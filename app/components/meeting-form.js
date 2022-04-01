import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { useTask, trackedFunction } from 'ember-resources';
import { inject as service } from '@ember/service';
import isValidMandateeForMeeting from '../utils/is-valid-mandatee-for-meeting';
import { articlesBasedOnClassifcationMap } from '../utils/classification-utils';

/** @typedef {import("../models/agendapunt").default[]} Agendapunt */

export default class MeetingForm extends Component {
  @service store;
  @service currentSession;
  @service router;

  zittingRT = useTask(this, this.fetchZittingData, () => [this.args.zitting.id]);

  //Easier and cleaner
  //get someTestValue() {
  //  if (this.zittingRT.isFinished) {
  //    return this.zittingRT.value.get('bestuursorgaan.isTijdsspecialisatieVan.classificatie.uri');
  //  }
  //}
  //More complicated
  //someTestValueRT = trackedFunction(this, async () => {
  //  if (this.zittingRT.isFinished) {
  //    return this.zittingRT.value.get('bestuursorgaan.isTijdsspecialisatieVan.classificatie.uri');
  //  }
  //});

  get bestuursorgaan() {
    if (this.zittingRT.isFinished)
      return this.zittingRT.value.get('bestuursorgaan');
  }

  //We need a tracked function because of the async await, and the function applied on the awaited value.
  headerArticleTranslationStringTracked = trackedFunction(this, async () => {
    if (this.zittingRT.isFinished) {
      const uri = await this.zittingRT.value.get('bestuursorgaan.isTijdsspecialisatieVan.classificatie.uri');
      return articlesBasedOnClassifcationMap[uri];
    } else {
      return '';
    }
  });

  //A getter around the tracked function so that we don't need `.value` in the template.
  get headerArticleTranslationString() {
    return this.headerArticleTranslationStringTracked.value ?? '';
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }

  get isComplete() {
    return !this.args.zitting.isNew && this.behandelingen.length > 0;
  }

  get voorzitter() {
    if (this.zittingRT.isFinished)
      return this.zittingRT.value.get('voorzitter');
  }

  get secretaris() {
    if (this.zittingRT.isFinished)
      return this.zittingRT.value.get('secretaris');
  }

  behandelingenRT = useTask(this, this.fetchTreatments, () => [this.args.zitting.id]); 
  get behandelingen() {
    if (this.behandelingenRT.isFinished) {
      return this.behandelingenRT.value;
    } else {
      return [];
    }
  }

  aanwezigenBijStartRT = useTask(this, this.fetchPresentParticipants, () => [this.args.zitting.id]);
  get aanwezigenBijStart() {
    if (this.aanwezigenBijStartRT.isFinished)
      return this.aanwezigenBijStartRT.value;
    else
      return [];
  }

  afwezigenBijStartRT = useTask(this, this.fetchAbsentParticipants, () => [this.args.zitting.id]);
  get afwezigenBijStart() {
    if (this.afwezigenBijStartRT.isFinished)
      return this.afwezigenBijStartRT.value
    else
      return [];
  }

  possibleParticipantsRT = useTask(this, this.fetchPossibleParticipants);
  get possibleParticipants() {
    if (this.possibleParticipantsRT.isFinished)
      return this.possibleParticipantsRT.value;
    else
      return [];
  }

  @task
  *fetchZittingData(zittingId) {
    const zittingQuery = {
      //'filter[:id:]': zittingId,
      include: [
        'bestuursorgaan',
        'bestuursorgaan.is-tijdsspecialisatie-van',
        'bestuursorgaan.is-tijdsspecialisatie-van.classificatie',
        'voorzitter',
        'voorzitter.bekleedt',
        'voorzitter.bekleedt.bestuursfunctie',
        'voorzitter.is-bestuurlijke-alias-van',
        'voorzitter.is-bestuurlijke-alias-van.geboorte',
        'secretaris',
        'secretaris.bekleedt',
        'secretaris.bekleedt.rol',
        'secretaris.is-bestuurlijke-alias-van',
        'secretaris.is-bestuurlijke-alias-van.geboorte',
      ].join(),
    };
    yield Promise.resolve();
    //const zitting = yield this.store.query('zitting', zittingQuery);
    const zitting = yield this.store.findRecord('zitting', zittingId, zittingQuery);
    return zitting;
  }

  @task
  *fetchPresentParticipants(zittingId) {
    const participantQuery = {
      include: [
        'is-bestuurlijke-alias-van',
        'is-bestuurlijke-alias-van.geboorte',
        'status',
        'bekleedt',
        'bekleedt.bestuursfunctie'
      ].join(),
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-zitting][:id:]': zittingId,
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    yield Promise.resolve();
    const present = yield this.store.query('mandataris', participantQuery);
    return present;
  }
  
  @task
  *fetchAbsentParticipants(zittingId) {
    const absenteeQuery = {
      include: [
        'is-bestuurlijke-alias-van',
        'is-bestuurlijke-alias-van.geboorte',
        'status',
        'bekleedt',
        'bekleedt.bestuursfunctie'
      ].join(),
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[afwezig-bij-zitting][:id:]': zittingId,
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    yield Promise.resolve();
    const absent = yield this.store.query('mandataris', absenteeQuery);
    return absent;
  }

  @task
  *fetchPossibleParticipants() {
    if (!this.bestuursorgaan) return;
    yield Promise.resolve();
    const aanwezigenRoles = yield this.store.query('bestuursfunctie-code', {
      'filter[standaard-type-van][is-classificatie-van][heeft-tijdsspecialisaties][:id:]':
        this.bestuursorgaan.get('id'),
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
    const mandatees = yield this.store.query('mandataris', queryParams);
    const participants = Array.from(
      mandatees.filter((mandatee) =>
        isValidMandateeForMeeting(mandatee, this.args.zitting)
      )
    );
    return participants;
  }

  @task
  *fetchTreatments(zittingId) {
    const treatments = new Array();
    const pageSize = 20;
    yield Promise.resolve();
    const firstPage = yield this.store.query('behandeling-van-agendapunt', {
      include: 'voorzitter,secretaris',
      'filter[onderwerp][zitting][:id:]': zittingId,
      'page[size]': pageSize,
      sort: 'onderwerp.position',
    });
    const count = firstPage.meta.count;
    firstPage.forEach((result) => treatments.push(result));
    let pageNumber = 1;
    while (pageNumber * pageSize < count) {
      const pageResults = yield this.store.query('behandeling-van-agendapunt', {
        'filter[onderwerp][zitting][:id:]': zittingId,
        'page[size]': pageSize,
        'page[number]': pageNumber,
        sort: 'onderwerp.position',
      });
      pageResults.forEach((result) => treatments.push(result));
      pageNumber++;
    }
    return treatments;
  }

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
    this.args.zitting.voorzitter = chairman;
    this.args.zitting.secretaris = secretary;
    this.args.zitting.aanwezigenBijStart = participants;
    this.args.zitting.afwezigenBijStart = absentees;
    await this.args.zitting.save();
  }

  @action
  goToPublish() {
    this.router.transitionTo('meetings.publish.agenda', this.args.zitting.id);
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
