import Controller from '@ember/controller';
import {inject as service} from "@ember/service";
import {task} from "ember-concurrency-decorators";
import {tracked} from "@glimmer/tracking";
import { action } from '@ember/object';

export default class MeetingsPublishNotulenController extends Controller {
  @service ajax;

  @tracked notulen;

  behandelingContainerId = 'behandeling-van-agendapunten-container';
  @tracked publicBehandelingUris = [];
  @tracked behandelings;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeNotulen.perform();
  }


  @task
  * initializeNotulen() {
    const notulen = yield this.store.query('versioned-notulen',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    if(notulen.length) {
      this.notulen = notulen.firstObject;
      this.publicBehandelingUris = notulen.firstObject.publicBehandelingen;
    } else {
      const prePublish = yield this.createPrePublishedResource.perform();
      const rslt = yield this.store.createRecord("versioned-notulen", {
        zitting: this.model,
        content: prePublish
      });
      this.notulen = rslt;
    }
    const behandelings = yield this.fetchBehandelings.perform();
    this.behandelings = behandelings;
  }


  @task
  *createPrePublishedResource() {
    const id = this.model.id;
    const response = yield this.ajax.request(
      `/prepublish/notulen/${id}`
    );
    return response.data.attributes.content;
  }

  @task
  *fetchBehandelings() {
    const id = this.model.id;
    const responses = yield this.ajax.request(
      `/prepublish/behandelingen/${id}`
    );
    return responses.map((response) => response.data.attributes);
  }

  @task
  * createSignedResource() {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/notulen/sign/${id}`
    );
    yield this.initializeNotulen.perform();
  }

  @task
  * createPublishedResource() {
    const id = this.model.id;
    yield this.ajax.post(
      `/signing/notulen/publish/${id}`,
      {
        contentType: 'application/vnd.api+json',
        data: {
          'public-behandeling-uris': this.publicBehandelingUris
        }
      }
    );
    yield this.initializeNotulen.perform();

  }

  get zittingWrapper(){
    if (this.notulen.content) {
      const div = document.createElement('div');
      div.innerHTML = this.notulen.content;

      const bvapContainer = div.querySelector("[property='http://mu.semte.ch/vocabularies/ext/behandelingVanAgendapuntenContainer']");
      bvapContainer.innerHTML = '';
      bvapContainer.id = this.behandelingContainerId;

      return div.innerHTML;
    } else {
      return null;
    }
  }

  updateNotulenPreview() {
    const div = document.createElement('div');
    div.innerHTML = this.notulen.content;

    const behandelingNodes = div.querySelectorAll("[typeof='besluit:BehandelingVanAgendapunt']");
    behandelingNodes.forEach((node) => {
      const uri = node.attributes['resource'] && node.attributes['resource'].value;
      if (this.publicBehandelingUris.includes(uri)) {
        node.classList.remove('behandeling-preview--niet-publiek');
      } else {
        node.classList.add('behandeling-preview--niet-publiek');
      }
    });

    this.notulen.set('body', div.innerHTML);
  }

  @action
  togglePublicationStatus(behandeling) {
    const uri = behandeling.behandeling;
    if (this.publicBehandelingUris.includes(uri))
      this.publicBehandelingUris.removeObject(uri);
    else
      this.publicBehandelingUris.pushObject(uri);
    this.updateNotulenPreview();
  }
}
