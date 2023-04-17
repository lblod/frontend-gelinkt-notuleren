import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import isValidMandateeForMeeting from 'frontend-gelinkt-notuleren/utils/is-valid-mandatee-for-meeting';
import { articlesBasedOnClassifcationMap } from '../utils/classification-utils';
import { trackedFunction } from 'ember-resources/util/function';

/** @typedef {import("../models/agendapunt").default[]} Agendapunt */

export default class MeetingForm extends Component {
  @tracked aanwezigenBijStart;
  @tracked afwezigenBijStart;
  @tracked voorzitter;
  @tracked secretaris;
  @tracked zitting;
  @tracked bestuursorgaan;
  @tracked possibleParticipants;
  @tracked behandelingen;
  @tracked headerArticleTranslationString = '';
  @tracked isPublished = false;
  @service store;
  @service currentSession;
  @service router;
  @service intl;

  isPublished = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();
    const publishedNotulen = await this.store.query('versioned-notulen', {
      'filter[zitting][id]': this.zitting.get('id'),
      'filter[:has:published-resource]': 'yes',
      'fields[versioned-notulen]': 'id',
    });
    return !!publishedNotulen.firstObject;
  });

  isSigned = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();
    const publishedNotulen = await this.store.query('versioned-notulen', {
      'filter[zitting][id]': this.zitting.get('id'),
      'filter[:has:signed-resources]': 'yes',
      'fields[versioned-notulen]': 'id',
    });
    return !!publishedNotulen.firstObject;
  });

  get status() {
    if (this.isPublished.value) {
      return this.intl.t('meeting-form.notulen-published');
    } else if (this.isSigned.value) {
      return this.intl.t('meeting-form.notulen-signed');
    } else {
      return null;
    }
  }

  get readOnly() {
    return (
      (!this.currentSession.canWrite && this.currentSession.canRead) ||
      this.isSigned.value ||
      this.isPublished.value
    );
  }

  constructor() {
    super(...arguments);
    this.zitting = this.args.zitting;
    this.loadData.perform();
  }

  get isComplete() {
    return !this.zitting.isNew && this.behandelingen?.length > 0;
  }

  loadData = task(async () => {
    if (this.zitting.get('id')) {
      this.bestuursorgaan = await this.zitting.get('bestuursorgaan');
      const specialisedBestuursorgaan = await this.bestuursorgaan.get(
        'isTijdsspecialisatieVan'
      );
      const classification = await specialisedBestuursorgaan.get(
        'classificatie'
      );
      this.headerArticleTranslationString =
        articlesBasedOnClassifcationMap[classification.get('uri')];
      this.secretaris = await this.zitting.get('secretaris');
      this.voorzitter = await this.zitting.get('voorzitter');
      await this.fetchParticipants.perform();
      await this.fetchTreatments.perform();
    }
  });

  fetchParticipants = task(async () => {
    if (this.bestuursorgaan) {
      await this.fetchPossibleParticipants.perform();
    }
    const participantQuery = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-zitting][:id:]': this.zitting.get('id'),
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };

    const absenteeQuery = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[afwezig-bij-zitting][:id:]': this.zitting.get('id'),
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const present = await this.store.query('mandataris', participantQuery);
    const absent = await this.store.query('mandataris', absenteeQuery);
    this.aanwezigenBijStart = present;
    this.afwezigenBijStart = absent;
  });

  fetchPossibleParticipants = task(async () => {
    const aanwezigenRoles = await this.store.query('bestuursfunctie-code', {
      'filter[standaard-type-van][is-classificatie-van][heeft-tijdsspecialisaties][:id:]':
        this.bestuursorgaan.id,
    });
    const stringifiedDefaultTypeIds = aanwezigenRoles
      .map((t) => t.id)
      .join(',');
    let queryParams = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[bekleedt][bevat-in][:uri:]': this.bestuursorgaan.get('uri'),
      'filter[bekleedt][bestuursfunctie][:id:]': stringifiedDefaultTypeIds,
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const mandatees = await this.store.query('mandataris', queryParams);
    this.possibleParticipants = Array.from(
      mandatees.filter((mandatee) =>
        isValidMandateeForMeeting(mandatee, this.zitting)
      )
    );
  });

  fetchTreatments = task(async () => {
    const treatments = new Array();
    const pageSize = 20;
    const firstPage = await this.store.query('behandeling-van-agendapunt', {
      include: 'voorzitter,secretaris',
      'filter[onderwerp][zitting][:id:]': this.args.zitting.id,
      'page[size]': pageSize,
      sort: 'onderwerp.position',
    });
    const count = firstPage.meta.count;
    firstPage.forEach((result) => treatments.push(result));
    let pageNumber = 1;
    while (pageNumber * pageSize < count) {
      const pageResults = await this.store.query('behandeling-van-agendapunt', {
        'filter[onderwerp][zitting][:id:]': this.args.zitting.id,
        'page[size]': pageSize,
        'page[number]': pageNumber,
        sort: 'onderwerp.position',
      });
      pageResults.forEach((result) => treatments.push(result));
      pageNumber++;
    }
    this.behandelingen = treatments;
  });

  /**
   * Persist the participants of the zitting
   * @param {Object} info
   * @return {Promise<void>}
   */
  @action
  async saveParticipationList({
    chairman,
    secretary,
    participants,
    absentees,
  }) {
    this.secretaris = secretary;
    this.voorzitter = chairman;
    this.aanwezigenBijStart = participants;
    this.afwezigenBijStart = absentees;
    this.zitting.voorzitter = chairman;
    this.zitting.secretaris = secretary;
    this.zitting.aanwezigenBijStart = participants;
    this.zitting.afwezigenBijStart = absentees;
    await this.zitting.save();
  }

  @action
  goToPublish() {
    this.router.transitionTo('meetings.publish.agenda', this.args.zitting.id);
  }

  get meetingDateForTitle() {
    if (this.zitting?.gestartOpTijdstip) {
      return this.zitting.gestartOpTijdstip;
    } else return this.zitting.geplandeStart;
  }

  @action
  async meetingInfoUpdate(zitting) {
    const bestuursorgaan = await zitting.get('bestuursorgaan');
    if (bestuursorgaan != this.bestuursorgaan) {
      this.bestuursorgaan = bestuursorgaan;
      this.fetchPossibleParticipants.perform();
    }
  }
}
