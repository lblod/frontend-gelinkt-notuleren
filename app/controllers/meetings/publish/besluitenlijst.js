import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { service } from '@ember/service';
/** @typedef {import("../../../models/zitting").default} Zitting */

/**
 * @extends {Controller}
 * @property {Zitting} model
 */
export default class MeetingsPublishBesluitenlijstController extends Controller {
  @service store;
  @tracked besluitenlijst;
  @tracked validationErrors;
  @tracked error;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeBesluitenLijst.perform();
  }

  initializeBesluitenLijst = task(async () => {
    try {
      const behandelings = await this.store.query('versioned-besluiten-lijst', {
        'filter[zitting][:id:]': this.model.id,
        'filter[deleted]': false,
        include: 'signed-resources,published-resource',
      });
      if (behandelings.length) {
        this.besluitenlijst = behandelings.firstObject;
      } else {
        const { content, errors } =
          await this.createPrePublishedResource.perform();
        const rslt = await this.store.createRecord(
          'versioned-besluiten-lijst',
          {
            zitting: this.model,
            content: content,
          }
        );
        this.besluitenlijst = rslt;
        this.validationErrors = errors;
      }
    } catch (e) {
      this.error = e;
    }
  });

  async pollForPrepublisherResults(meetingId) {
    let uuidResp = await fetch(`/prepublish/besluitenlijst/${meetingId}`);
    let jobId = (await uuidResp.json()).data.attributes.jobId;

    let maxIterations = 600;
    let resp;
    do {
      await timeout(1000);
      resp = await fetch(`/prepublish/job-result/${jobId}`);
      maxIterations--;
    } while (resp.status === 404 && maxIterations > 0);

    if (resp.status !== 200) {
      throw new Error(await resp.text());
    } else {
      return await resp.json();
    }
  }

  reloadBesluitenLijst = task(async () => {
    const behandelings = await this.store.query('versioned-besluiten-lijst', {
      'filter[zitting][:id:]': this.model.id,
      'filter[deleted]': false,
      include: 'signed-resources,published-resource',
    });
    this.besluitenlijst = behandelings.firstObject;
  });

  createPrePublishedResource = task(async () => {
    const id = this.model.id;
    const json = await this.pollForPrepublisherResults(id);
    return json.data.attributes;
  });

  createSignedResource = task(async () => {
    const id = this.model.id;
    const result = await fetch(`/signing/besluitenlijst/sign/${id}`, {
      method: 'POST',
    });
    const json = await result.json();
    const taskId = json.data.id;
    let maxIterations = 600;
    let status;
    let iteration = 0;
    do {
      await timeout(1000);
      const result = await fetch(`/publication-tasks/${taskId}`);
      const json = await result.json();
      status = json.data.status;
      iteration++;
    } while (
      status !=
        'http://lblod.data.gift/besluit-publicatie-melding-statuses/success' ||
      iteration > maxIterations
    );
    await this.reloadBesluitenLijst.perform();
    const signedResources = await this.besluitenlijst.signedResources;
    return signedResources;
  });

  createPublishedResource = task(async () => {
    const id = this.model.id;
    const result = await fetch(`/signing/besluitenlijst/publish/${id}`, {
      method: 'POST',
    });
    const json = await result.json();
    const taskId = json.data.id;
    let maxIterations = 600;
    let status;
    let iteration = 0;
    do {
      await timeout(1000);
      const result = await fetch(`/publication-tasks/${taskId}`);
      const json = await result.json();
      status = json.data.status;
      iteration++;
    } while (
      status !=
        'http://lblod.data.gift/besluit-publicatie-melding-statuses/success' ||
      iteration > maxIterations
    );
    await this.reloadBesluitenLijst.perform();
    const publishedResource = await this.besluitenlijst.publishedResource;
    return publishedResource;
  });
}
