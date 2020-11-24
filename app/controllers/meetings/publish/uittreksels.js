import Controller from '@ember/controller';
import {inject as service} from "@ember/service";
import {task} from "ember-concurrency-decorators";
import {tracked} from "@glimmer/tracking";

export default class MeetingsPublishUittrekselsController extends Controller {
  @service ajax;

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
        'filter[behandeling][:id:]': uittreksel.data.attributes.behandeling,
        include: 'signed-resources,published-resource'
      });
      if(existingUittreksels.length) {
        uittreksels.push(existingUittreksels.firstObject);
      } else {
        const behandeling = yield this.store.findRecord('behandeling-van-agendapunt', uittreksel.data.attributes.behandeling);

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
    const response = yield this.ajax.request(
      `/prepublish/behandelingen/${id}`
    );
    return response;
  }

  @task
  * createSignedResource(behandeling) {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/behandeling/sign/${id}/${behandeling.get('id')}`
    );
    yield this.initializeUittreksels.perform();
  }

  @task
  * createPublishedResource(behandeling) {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/behandeling/publish/${id}/${behandeling.get('id')}`
    );
    yield this.initializeUittreksels.perform();

  }
}
