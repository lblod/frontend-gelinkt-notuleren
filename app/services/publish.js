import Service, { inject as service } from '@ember/service';
import { task, all, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';

export class Extract {
  @tracked treatmentId;
  @tracked position;
  @tracked document;
  @tracked errors;

  constructor(treatmentId, position, document, errors) {
    this.treatmentId = treatmentId;
    this.position = position;
    this.document = document;
    this.errors = errors;
  }
}

/**
 * WIP service to abstract away the api calls need for the publication flow
 *
 * Expects the developer to manage when to update the treatment extracts.
 *
 * TODO: build out the rest of the api
 * TODO: consider getting rid of the state altogether
 *
 */
export default class PublishService extends Service {
  @tracked treatmentExtractsMap;
  @service store;

  constructor(...args) {
    super(...args);
    this.treatmentExtractsMap = new Map();
  }

  get treatmentExtracts() {
    return [...this.treatmentExtractsMap.values()].sortBy('position');
  }

  get isIdle() {
    return this.loadExtractsTask.isIdle;
  }

  get loadExtractsTask() {
    // for background, see https://github.com/machty/ember-concurrency/issues/161
    return this._loadExtractsTask.unlinked();
  }

  /**
   * Combine saved extracts with newly created ones and expose them as one map keyed by the
   * id of the treatment
   * TODO: proper pagination
   * @param meetingId
   * @return {Generator<*, void, *>}
   */
  @task
  *_loadExtractsTask(meetingId) {
    const [newExtracts, meeting, treatments, versionedTreatments] = yield all([
      async () => {
        let uuidResp = await fetch(`/prepublish/behandelingen/${meetingId}`);
        let jobId = (await uuidResp.json()).data.attributes.jobId;

        let maxIterations = 600;
        let resp;
        do {
          await timeout(1000);
          resp = await fetch(`/prepublish/job-result/${jobId}`);
        } while( resp.status == "404" && maxIterations-- > 0 );

        if (resp.status != 200) {
          throw new Error(await resp.text());
        } else {
          return await resp.json();
        }
      },
      this.store.findRecord('zitting', meetingId),
      this.store.query('behandeling-van-agendapunt', {
        'filter[onderwerp][zitting][:id:]': meetingId,
        include: 'onderwerp',
        page: { size: 1000 },
      }),
      this.store.query('versioned-behandeling', {
        'filter[zitting][:id:]': meetingId,
        include: 'behandeling.onderwerp,signed-resources,published-resource',
        page: { size: 1000 },
      }),
    ]);

    // map all treatments to their ids for later retrieval
    const treatmentMap = new Map();
    treatments.forEach((treatment) =>
      treatmentMap.set(treatment.id, treatment)
    );

    // map all existing extracts to their behandeling id
    const extractMap = new Map();
    versionedTreatments.forEach((versionedTreatment) => {
      extractMap.set(
        versionedTreatment.behandeling.get('id'),
        new Extract(
          versionedTreatment.behandeling.get('id'),
          versionedTreatment.get('behandeling.onderwerp.position'),
          versionedTreatment
        )
      );
    });

    // loop over new extracts and create a VersionedBehandeling if it doesn't exist yet
    for (const extract of newExtracts) {
      const treatmentId = extract.data.attributes.uuid;
      if (!extractMap.has(treatmentId)) {
        const treatment = treatmentMap.get(treatmentId);
        const versionedTreatment = this.store.createRecord(
          'versioned-behandeling',
          {
            zitting: meeting,
            content: extract.data.attributes.content,
            behandeling: treatment,
          }
        );
        extractMap.set(
          treatmentId,
          new Extract(
            treatmentId,
            treatment.get('onderwerp.position'),
            versionedTreatment,
            extract.data.attributes.errors
          )
        );
      }
    }
    this.treatmentExtractsMap = extractMap;
  }
}
