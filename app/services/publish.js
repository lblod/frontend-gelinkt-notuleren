import Service, { service } from '@ember/service';
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
    return [...this.treatmentExtractsMap.values()].sort(
      (a, b) => a.position - b.position,
    );
  }

  get isIdle() {
    return this.loadExtractsTask.isIdle;
  }

  get loadExtractsTask() {
    // for background, see https://github.com/machty/ember-concurrency/issues/161
    return this._loadExtractsTask.unlinked();
  }

  /**
   * @param {string} jobUrl
   * @param {number} pollingDelayMs
   * @param {number} maxIterations
   */
  fetchJobTask = task(
    async (jobUrl, pollingDelayMs = 1000, maxIterations = 600) => {
      return await this.createJobTask.perform(
        jobUrl,
        {},
        pollingDelayMs,
        maxIterations,
      );
    },
  );

  /**
   * @param {string} url
   * @param {string} method
   * @param {object} options fetch options
   * @param {number} pollingDelayMs
   * @param {number} maxIterations
   */
  createJobTask = task(
    async (url, options = {}, pollingDelayMs = 1000, maxIterations = 600) => {
      const job = await fetch(url, options);
      const jobData = await job.json();
      const jobId = jobData.data.attributes.jobId;

      let resp;
      do {
        await timeout(pollingDelayMs);
        resp = await fetch(`/prepublish/job-result/${jobId}`);
        maxIterations--;
      } while (resp.status === 404 && maxIterations > 0);

      if (!resp.ok) {
        let errors;
        try {
          const json = await resp.json();
          if (json?.errors) {
            errors = json.errors[0]?.title || JSON.stringify(json.errors);
          }
        } catch (_e) {
          // throwing body text
          errors = await resp.text();
          throw new Error(errors);
        }
        // throwing stringified json body
        throw new Error(errors);
      } else {
        return await resp.json();
      }
    },
  );

  /**
   * Combine saved extracts with newly created ones and expose them as one map keyed by the
   * id of the treatment
   * TODO: proper pagination
   * @param meetingId
   * @return {Generator<*, void, *>}
   */
  _loadExtractsTask = task(async (meetingId) => {
    const [newExtracts, meeting, treatments, versionedTreatments] = await all([
      this.fetchJobTask.perform(`/prepublish/behandelingen/${meetingId}`),
      this.store.findRecord('zitting', meetingId),
      this.store.query('behandeling-van-agendapunt', {
        'filter[onderwerp][zitting][:id:]': meetingId,
        include: 'onderwerp',
        page: { size: 1000 },
      }),
      this.store.query('versioned-behandeling', {
        'filter[zitting][:id:]': meetingId,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': false,
        include: 'behandeling.onderwerp,signed-resources,published-resource',
        page: { size: 1000 },
      }),
    ]);

    // map all treatments to their ids for later retrieval
    const treatmentMap = new Map();
    treatments.forEach((treatment) =>
      treatmentMap.set(treatment.id, treatment),
    );

    // map all existing extracts to their behandeling id
    const extractMap = new Map();
    versionedTreatments.forEach((versionedTreatment) => {
      extractMap.set(
        versionedTreatment.behandeling.get('id'),
        new Extract(
          versionedTreatment.behandeling.get('id'),
          versionedTreatment.get('behandeling.onderwerp.position'),
          versionedTreatment,
        ),
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
          },
        );
        extractMap.set(
          treatmentId,
          new Extract(
            treatmentId,
            treatment.get('onderwerp.position'),
            versionedTreatment,
            extract.data.attributes.errors,
          ),
        );
      }
    }
    this.treatmentExtractsMap = extractMap;
  });

  async fetchTreatmentPreviews(meetingId) {
    return this.fetchJobTask.perform(`/prepublish/behandelingen/${meetingId}`);
  }

  async fetchExtract(treatment) {
    const agendapoint = await treatment.get('onderwerp');
    const meeting = await agendapoint.get('zitting');
    const versionedTreatments = await this.store.query(
      'versioned-behandeling',
      {
        'filter[behandeling][:id:]': treatment.id,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
        include: 'behandeling.onderwerp,signed-resources,published-resource',
      },
    );
    if (versionedTreatments.length > 0) {
      return new Extract(
        treatment.id,
        agendapoint.get('position'),
        versionedTreatments[0],
        [],
      );
    } else {
      const extractPreview = this.store.createRecord('extract-preview', {
        treatment,
      });
      await extractPreview.save();
      const versionedTreatment = this.store.createRecord(
        'versioned-behandeling',
        {
          zitting: meeting,
          content: extractPreview.html,
          behandeling: treatment,
        },
      );
      return new Extract(
        treatment.id,
        agendapoint.get('position'),
        versionedTreatment,
        extractPreview.validationErrors,
      );
    }
  }
}
