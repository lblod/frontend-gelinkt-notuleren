import Controller from '@ember/controller';
import {task} from "ember-concurrency";
import {tracked} from "@glimmer/tracking";
import { action } from '@ember/object';
import { fetch } from 'fetch';

export default class MeetingsPublishNotulenController extends Controller {

  @tracked notulen;
  @tracked errors;

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
      const {content, errors} = yield this.createPrePublishedResource.perform();
      const rslt = yield this.store.createRecord("versioned-notulen", {
        zitting: this.model,
        content: content
      });
      this.notulen = rslt;
      this.errors = errors;
    }
    const behandelings = yield this.fetchBehandelings.perform();
    this.behandelings = behandelings;
  }

  @task
  *reloadNotulen() {
    const notulen = yield this.store.query('versioned-notulen',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    this.notulen = notulen.firstObject;
    this.publicBehandelingUris = notulen.firstObject.publicBehandelingen;
    const behandelings = yield this.fetchBehandelings.perform();
    this.behandelings = behandelings;
  }


  @task
  *createPrePublishedResource() {
    const id = this.model.id;
    const response = yield fetch(`/prepublish/notulen/${id}`);
    const json = yield response.json();
    return json.data.attributes;
  }

  @task
  *fetchBehandelings() {
    const id = this.model.id;
    const response = yield fetch(`/prepublish/behandelingen/${id}`);
    const json = yield response.json();

    return json.map((response) => response.data.attributes);
  }

  @task
  * createSignedResource() {
    const id = this.model.id;
    yield fetch(`/signing/notulen/sign/${id}`, { method: 'POST' });
    setTimeout(() => this.reloadNotulen.perform(), 500);
  }

  @task
  * createPublishedResource() {
    const id = this.model.id;
    yield fetch(`/signing/notulen/publish/${id}`,
                {
                  headers: { "Content-Type": 'application/vnd.api+json' },
                  body: JSON.stringify({
                    'public-behandeling-uris': this.publicBehandelingUris
                  }),
                  method: 'POST'
                });
    setTimeout(() => this.reloadNotulen.perform(), 500);
  }

  get zittingWrapper() {
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
