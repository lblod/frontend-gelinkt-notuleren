import Controller from "@ember/controller";
import {task} from "ember-concurrency-decorators";
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
  @tracked errors;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeBesluitenLijst.perform();
  }


  @task
  * initializeBesluitenLijst() {
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
      this.errors = errors;
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
    const response = yield fetch(`/prepublish/besluitenlijst/${id}`);
    const json = yield response.json();
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
