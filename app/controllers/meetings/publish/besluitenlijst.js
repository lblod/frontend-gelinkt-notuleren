import Controller from "@ember/controller";
import {task, timeout} from "ember-concurrency";
import {tracked} from "@glimmer/tracking";
import { fetch } from 'fetch';
/** @typedef {import("../../../models/zitting").default} Zitting */


/**
 * @extends {Controller}
 * @property {Zitting} model
 */
export default class MeetingsPublishBesluitenlijstController extends Controller {

  @tracked
  besluitenlijst;
  @tracked validationErrors;
  @tracked error;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeBesluitenLijst.perform();
  }


  @task
    * initializeBesluitenLijst() {
      try {
        const behandelings = yield this.store.query('versioned-besluiten-lijst',{
          'filter[zitting][:id:]': this.model.id,
          include: 'signed-resources,published-resource'
        });
        if(behandelings.length) {
          this.besluitenlijst = behandelings.firstObject;
        } else {
          const {content, errors} = yield this.createPrePublishedResource.perform();
          const rslt = yield this.store.createRecord("versioned-besluiten-lijst", {
            zitting: this.model,
            content: content
          });
          this.besluitenlijst = rslt;
          this.validationErrors = errors;
        }
      }
      catch(e) {
        this.error = e;
      }
  }

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

  @task
  * reloadBesluitenLijst() {
    const behandelings = yield this.store.query('versioned-besluiten-lijst',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    this.besluitenlijst = behandelings.firstObject;
  }


  @task
  *createPrePublishedResource() {
    const id = this.model.id;
    const json = yield this.pollForPrepublisherResults(id);
    return json.data.attributes;
  }

  @task
  * createSignedResource() {
    const id = this.model.id;
    yield fetch(`/signing/besluitenlijst/sign/${id}`, { method: 'POST' });
    yield this.reloadBesluitenLijst.perform();
  }

  @task
  * createPublishedResource() {
    const id = this.model.id;
    yield fetch(`/signing/besluitenlijst/publish/${id}`, { method: 'POST' });
    yield this.reloadBesluitenLijst.perform();
  }
}
