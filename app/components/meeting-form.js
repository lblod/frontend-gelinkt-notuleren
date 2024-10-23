import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { task, all, restartableTask } from 'ember-concurrency';
import { service } from '@ember/service';
import { articlesBasedOnClassifcationMap } from '../utils/classification-utils';
import { trackedFunction } from 'reactiveweb/function';
import { trackedTask } from 'reactiveweb/ember-concurrency';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';
import {
  MANDATARIS_STATUS_EFFECTIEF,
  MANDATARIS_STATUS_WAARNEMEND,
} from '../utils/constants';

/** @typedef {import("../models/agendapunt").default[]} Agendapunt */

export default class MeetingForm extends Component {
  @tracked aanwezigenBijStart;
  @tracked afwezigenBijStart;
  @tracked showDeleteModal;
  behandelingen = tracked([]);
  @service store;
  @service currentSession;
  @service router;
  @service intl;

  isPublished = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();
    const publishedNotulen = await this.store.query('versioned-notulen', {
      'filter[zitting][id]': this.zitting.id,
      'filter[:has:published-resource]': 'yes',
      'fields[versioned-notulen]': 'id',
    });
    return !!publishedNotulen.firstObject;
  });

  canBeDeleted = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();
    const publicationFilter = {
      filter: {
        state: 'gepubliceerd',
        zitting: {
          id: this.args.meeting.id,
        },
      },
    };
    const versionedNotulen = await this.store.query(
      'versioned-notulen',
      publicationFilter,
    );
    const versionedBesluitenLijsten = await this.store.query(
      'versioned-besluiten-lijst',
      publicationFilter,
    );
    const versionedBehandelingen = await this.store.query(
      'versioned-behandeling',
      publicationFilter,
    );
    const agendas = await this.store.query('agenda', {
      filter: {
        'agenda-status': 'gepubliceerd',
        zitting: {
          id: this.args.meeting.id,
        },
      },
    });
    const publishedResourcesCount =
      agendas.length +
      versionedBehandelingen.length +
      versionedBesluitenLijsten.length +
      versionedNotulen.length;
    return publishedResourcesCount === 0;
  });

  isSigned = trackedFunction(this, async () => {
    // This is needed here, see https://github.com/NullVoxPopuli/ember-resources/issues/340
    await Promise.resolve();

    const signedResources = await this.store.query('signed-resource', {
      'filter[versioned-notulen][zitting][:id:]': this.zitting.id,
      'filter[:or:][deleted]': false,
      'filter[:or:][:has-no:deleted]': 'yes',
    });

    const arraySignedResources = signedResources.toArray();

    return !!arraySignedResources.length;
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

  get zitting() {
    return this.args.zitting;
  }

  get isInaugurationMeeting() {
    return this.zitting instanceof InstallatieVergaderingModel;
  }

  get isLoading() {
    return this.fetchTreatments.isRunning;
  }
  get isComplete() {
    return !this.zitting?.isNew && this.behandelingen?.length > 0;
  }
  get bestuursorgaan() {
    return this.meetingDetailsData.value?.bestuursorgaan ?? null;
  }
  get headerArticleTranslationString() {
    return (
      this.meetingDetailsData.value?.headerArticleTranslationString ??
      'meeting-form.meeting-heading-article-ungendered'
    );
  }
  get secretaris() {
    return this.meetingDetailsData.value?.secretaris ?? null;
  }
  get voorzitter() {
    return this.meetingDetailsData.value?.voorzitter ?? null;
  }

  meetingDetailsTask = restartableTask(async () => {
    const bestuursorgaan = await this.zitting.bestuursorgaan;
    const specialisedBestuursorgaan =
      await bestuursorgaan.isTijdsspecialisatieVan;
    const classification = await specialisedBestuursorgaan.classificatie;
    const headerArticleTranslationString =
      articlesBasedOnClassifcationMap[classification.uri];
    const secretaris = await this.zitting.secretaris;
    const voorzitter = await this.zitting.voorzitter;
    return {
      bestuursorgaan,
      headerArticleTranslationString,
      secretaris,
      voorzitter,
    };
  });
  meetingDetailsData = trackedTask(this, this.meetingDetailsTask, () => [
    this.zitting.secretaris,
    this.zitting.voorzitter,
    this.zitting.bestuursorgaan,
  ]);

  fetchParticipants = task(async () => {
    if (!this.zitting.id) {
      return null;
    }
    const participantQuery = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-zitting][:id:]': this.zitting.id,
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };

    const absenteeQuery = {
      include: 'is-bestuurlijke-alias-van,status',
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[afwezig-bij-zitting][:id:]': this.zitting.id,
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const present = await this.store.query('mandataris', participantQuery);
    const absent = await this.store.query('mandataris', absenteeQuery);
    this.aanwezigenBijStart = present;
    this.afwezigenBijStart = absent;
  });

  fetchPossibleParticipants = restartableTask(async () => {
    const aanwezigenRoles = await this.store.query('bestuursfunctie-code', {
      'filter[standaard-type-van][is-classificatie-van][heeft-tijdsspecialisaties][:id:]':
        this.bestuursorgaan.id,
    });
    const stringifiedDefaultTypeIds = aanwezigenRoles
      .map((t) => t.id)
      .join(',');
    const startOfMeeting =
      this.zitting.gestartOpTijdstip ?? this.zitting.geplandeStart;
    let queryParams = {
      include: [
        'is-bestuurlijke-alias-van',
        'is-bestuurlijke-alias-van.geboorte',
        'status',
        'bekleedt',
        'bekleedt.bestuursfunctie',
      ].join(','),
      sort: 'is-bestuurlijke-alias-van.achternaam',
      filter: {
        bekleedt: {
          'bevat-in': {
            ':uri:': this.bestuursorgaan.uri,
          },
          bestuursfunctie: {
            ':id:': stringifiedDefaultTypeIds,
          },
        },
        status: {
          ':id:': [
            MANDATARIS_STATUS_EFFECTIEF,
            MANDATARIS_STATUS_WAARNEMEND,
          ].join(','),
        },
        ':lte:start': startOfMeeting.toISOString(),
        ':or:': {
          ':has-no:einde': true,
          ':gt:einde': startOfMeeting.toISOString(),
        },
      },
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const mandatees = await this.store.query('mandataris', queryParams);
    return Array.from(mandatees);
  });

  possibleParticipantsData = trackedTask(
    this,
    this.fetchPossibleParticipants,
    () => [this.zitting.geplandeStart, this.zitting.gestartOpTijdstip],
  );
  get possibleParticipants() {
    return this.possibleParticipantsData.value ?? [];
  }
  fetchTreatments = task(async () => {
    this.behandelingen.clear();
    if (!this.zitting.id) {
      return null;
    }
    const pageSize = 20;
    const firstPage = await this.store.query('behandeling-van-agendapunt', {
      include: [
        'document-container.status',
        'document-container.current-version',
        'voorzitter',
        'secretaris',
        'onderwerp',
        'stemmingen',
        'aanwezigen.is-bestuurlijke-alias-van',
        'afwezigen.is-bestuurlijke-alias-van',
      ].join(','),
      'filter[onderwerp][zitting][:id:]': this.args.zitting.id,
      'page[size]': pageSize,
      sort: 'onderwerp.position',
    });
    const count = firstPage.meta.count;
    firstPage.forEach((result) => this.behandelingen.push(result));
    let pageNumber = 1;
    const queries = [];
    while (pageNumber * pageSize < count) {
      queries.push(
        this.store
          .query('behandeling-van-agendapunt', {
            'filter[onderwerp][zitting][:id:]': this.args.zitting.id,
            'page[size]': pageSize,
            'page[number]': pageNumber,
            include: [
              'document-container.status',
              'document-container.current-version',
              'voorzitter',
              'secretaris',
              'onderwerp',
              'stemmingen',
              'aanwezigen.is-bestuurlijke-alias-van',
              'afwezigen.is-bestuurlijke-alias-van',
            ].join(','),
            sort: 'onderwerp.position',
          })
          .then((results) => ({ pageNumber, results })),
      );

      pageNumber++;
    }
    const resultSets = await all(queries);
    resultSets
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .forEach(({ results }) =>
        results.forEach((result) => this.behandelingen.push(result)),
      );
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
  toggleFocusMode() {
    const newFocus = !this.args.focused;
    this.router.transitionTo({ queryParams: { focused: newFocus } });
  }
  @action
  toggleShowDeleteModal() {
    this.showDeleteModal = !this.showDeleteModal;
  }
}
