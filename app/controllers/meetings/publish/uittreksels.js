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
    const uittreksels = yield this.store.query('versioned-behandeling',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    if(uittreksels.length) {
      this.uittreksels = uittreksels;
    } else {
      this.uittreksels = [];
      const prePublish = yield this.createPrePublishedResource.perform();
      console.log(prePublish);
      for(const uittreksel of prePublish) {
        const behandeling = yield this.store.findRecord('behandeling-van-agendapunt', uittreksel.data.attributes.behandeling);
        const rslt = yield this.store.createRecord("versioned-behandeling", {
          zitting: this.model,
          content: uittreksel.data.attributes.content,
          behandeling,
        });
        this.uittreksels.push(rslt);
      }
      console.log(this.uittreksels);
    }
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
  * createSignedResource() {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/behandelingen/sign/${id}`
    );
    yield this.initializeUittreksels.perform();
  }

  @task
  * createPublishedResource() {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/behandelingen/publish/${id}`
    );
    yield this.initializeUittreksels.perform();

  }
}
