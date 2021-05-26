import Controller from '@ember/controller';
import {task} from "ember-concurrency";
import {tracked} from "@glimmer/tracking";
import { fetch } from 'fetch';
import { action } from '@ember/object';

export default class MeetingsPublishUittrekselsController extends Controller {
  @tracked uittreksels = [];

  @tracked errors;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.uittreksels = [];
    this.initializeUittreksels.perform();
  }

  get meeting() {
    return this.model;
  }

  @task
  * initializeUittreksels() {
    const uittreksels = [];
    const previews = yield this.fetchExtractPreviews.perform();
    for(const uittreksel of previews) {
      const existingUittreksels = yield this.store.query('versioned-behandeling',{
        'filter[behandeling][:id:]': uittreksel.data.attributes.uuid,
        include: 'signed-resources,published-resource,behandeling'
      });
      if(existingUittreksels.length) {
        uittreksels.push({document: existingUittreksels.firstObject});
      } else {
        const behandeling = yield this.store.findRecord('behandeling-van-agendapunt', uittreksel.data.attributes.uuid);
        const rslt = yield this.store.createRecord("versioned-behandeling", {
          zitting: this.meeting,
          content: uittreksel.data.attributes.content,
          behandeling,
        });
        uittreksels.push({document: rslt, errors: uittreksel.data.attributes.errors});
      }
    }
    this.uittreksels = uittreksels;
  }

  @task
  * reloadUittreksels() {
    const uittreksels = [];
    const previews = yield this.fetchExtractPreviews.perform();
    for(const uittreksel of previews) {
      const existingUittreksels = yield this.store.query('versioned-behandeling',{
        'filter[behandeling][:id:]': uittreksel.data.attributes.uuid,
        include: 'signed-resources,published-resource'
      });
      if(existingUittreksels.length) {
        uittreksels.push(existingUittreksels.firstObject);
      } else {
        const behandeling = yield this.store.findRecord('behandeling-van-agendapunt', uittreksel.data.attributes.uuid);
        const rslt = yield this.store.createRecord("versioned-behandeling", {
          zitting: this.model,
          content: uittreksel.data.attributes.content,
          behandeling,
        });
        uittreksels.push(rslt);
      }
    }
    this.uittreksels = uittreksels;
  }


  @task
  *fetchExtractPreviews() {
    const response = yield fetch(`/prepublish/behandelingen/${this.meeting.id}`);
    const json = yield response.json();
    return json;
  }

  @task
  * createSignedResource(behandeling) {
    const id = this.model.id;
    yield fetch(`/signing/behandeling/sign/${id}/${behandeling.get('id')}`, { method: 'POST'});
    yield this.reloadUittreksels.perform();
  }

  @task
  * createPublishedResource(behandeling) {
    const id = this.model.id;
    yield fetch(`/signing/behandeling/publish/${id}/${behandeling.get('id')}`, { method: 'POST' });
    yield this.reloadUittreksels.perform();

  }

  @action
  print(id) {
    this.transitionToRoute('print.uittreksel', id);
  }
}
