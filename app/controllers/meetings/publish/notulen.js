import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import {task} from "ember-concurrency";
import {tracked} from "@glimmer/tracking";
import { action } from '@ember/object';

export default class MeetingsPublishNotulenController extends Controller {

  @tracked notulen;
  @tracked errors;
  @tracked signedResources = [];
  @tracked publishedResource;

  behandelingContainerId = 'behandeling-van-agendapunten-container';
  @tracked publicBehandelingUris = [];
  @tracked behandelings;
  @service publish;
  @service muTask;

  constructor() {
    super(...arguments);
  }

  initialize() {
    this.initializeNotulen.perform();
  }


  @task
  * initializeNotulen() {
    const versionedNotulens = yield this.store.query('versioned-notulen',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    if(versionedNotulens.length) {
      yield Promise.all(versionedNotulens.map(async (notulen) => {
        const publishedResource = await notulen.publishedResource;
        const signedResources = await notulen.signedResources;
        if(publishedResource) {
          this.publishedResource = publishedResource;
          this.publicBehandelingUris = notulen.publicBehandelingen || [];
          this.notulen = notulen;
        }
        if(signedResources.length) {
          this.signedResources = signedResources;
          if(!this.notulen) {
            this.notulen = notulen;
          }
        }
      }));
    } else {
      const {content, errors} = yield this.createPrePublishedResource.perform();
      const rslt = yield this.store.createRecord("versioned-notulen", {
        zitting: this.model,
        content: content
      });
      this.publishedResource = undefined;
      this.signedResources = [];
      this.notulen = rslt;
      this.errors = errors;
    }
    const behandelings = yield this.fetchBehandelings.perform();
    this.behandelings = behandelings;
  }

  @task
  *reloadNotulen() {
    const versionedNotulens = yield this.store.query('versioned-notulen',{
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources,published-resource'
    });
    if(versionedNotulens.length) {
      yield Promise.all(versionedNotulens.map(async (notulen) => {
        const publishedResource = await notulen.publishedResource;
        const signedResources = await notulen.signedResources;
        if(publishedResource) {
          this.publishedResource = publishedResource;
          this.publicBehandelingUris = notulen.publicBehandelingen || [];
          this.notulen = notulen;
        }
        if(signedResources.length) {
          this.signedResources = signedResources;
          if(!this.notulen) {
            this.notulen = notulen;
          }
        }
      }));
    }
    
    const behandelings = yield this.fetchBehandelings.perform();
    this.behandelings = behandelings;
  }


  @task
  *createPrePublishedResource() {
    const id = this.model.id;
    const json = yield this.publish.fetchJobTask.perform(`/prepublish/notulen/${id}`);
    return json.data.attributes;
  }

  @task
  *fetchBehandelings() {
    const id = this.model.id;
    const response = yield this.publish.fetchTreatmentPreviews(id);

    return response.map((res) => res.data.attributes);
  }

  @task
  * createSignedResource() {
    const id = this.model.id;
    const taskId = yield this.muTask.fetchTaskifiedEndpoint(`/signing/notulen/sign/${id}`, { method: 'POST' });
    yield this.muTask.waitForMuTaskTask.perform(taskId);
    setTimeout(() => this.reloadNotulen.perform(), 1);
  }

  @task
  * createPublishedResource() {
    const id = this.model.id;
    const taskId = yield this.muTask.fetchTaskifiedEndpoint(
      `/signing/notulen/publish/${id}`,
      {headers: { "Content-Type": 'application/vnd.api+json' },
       body: JSON.stringify({'public-behandeling-uris': this.publicBehandelingUris}),
       method: 'POST'});
    yield this.muTask.waitForMuTaskTask.perform(taskId);
    setTimeout(() => this.reloadNotulen.perform(), 1);
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
