import Controller from '@ember/controller';
import {task} from "ember-concurrency-decorators";
import {tracked} from "@glimmer/tracking";
import { fetch } from 'fetch';

export default class MeetingsPublishUittrekselsController extends Controller {
  @tracked
  uittreksels = [];

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeUittreksels.perform();
  }


  @task
  * initializeUittreksels() {
    const uittreksels = [];
    const prePublish = yield this.createPrePublishedResource.perform();
    for(const uittreksel of prePublish) {
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
  * reloadUittreksels() {
    const uittreksels = [];
    const prePublish = yield this.createPrePublishedResource.perform();
    for(const uittreksel of prePublish) {
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
  *createPrePublishedResource() {
    const id = this.model.id;
    const response = yield fetch(`/prepublish/behandelingen/${id}`);
    return yield response.json();
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
}
