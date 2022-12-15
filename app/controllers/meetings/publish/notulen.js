import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class MeetingsPublishNotulenController extends Controller {
  @service store;
  @service publish;
  @service muTask;

  behandelingContainerId = 'behandeling-van-agendapunten-container';
  @tracked notulen;
  @tracked errors;
  @tracked validationErrors;
  @tracked signedResources = [];
  @tracked publishedResource;
  @tracked publicBehandelingUris = [];
  @tracked treatments;
  @tracked allBehandelingPublic = false;
  @tracked preview;
  @tracked showSigningModal = false;
  @tracked showPublishingModal = false;

  constructor() {
    super(...arguments);
  }

  resetController() {
    this.notulen = null;
    this.errors = null;
    this.validationErrors = null;
    this.signedResources = [];
    this.publishedResource = null;
    this.publicBehandelingUris = [];
    this.treatments = null;
    this.allBehandelingPublic = false;
    this.preview = null;
    this.showSigningModal = false;
    this.showPublishingModal = false;
  }

  initialize() {
    this.loadNotulen.perform();
  }

  get containerElement() {
    return document.getElementById(this.behandelingContainerId);
  }

  get showPublicToggles() {
    return this.status != 'published' && this.containerElement;
  }

  get status() {
    if (this.publishedResource) return 'published';
    if (this.signedResources.length === 1) return 'firstSignature';
    if (this.signedResources.length === 2) return 'secondSignature';
    return 'concept';
  }

  loadNotulen = task(async () => {
    const versionedNotulens = await this.store.query('versioned-notulen', {
      'filter[zitting][:id:]': this.model.id,
      include: 'signed-resources.gebruiker,published-resource.gebruiker',
    });
    if (versionedNotulens.length) {
      let notulenSet = false;
      await Promise.all(
        versionedNotulens.map(async (notulen) => {
          const publishedResource = await notulen.publishedResource;
          const signedResources = await notulen.signedResources;
          if (publishedResource) {
            this.publishedResource = publishedResource;
            this.publicBehandelingUris = notulen.publicBehandelingen || [];
            this.notulen = notulen;
            notulenSet = true;
          }
          if (signedResources.length) {
            this.signedResources = signedResources;
            if (!notulenSet) {
              this.notulen = notulen;
            }
          }
        })
      );
    } else {
      try {
        const { content, errors } =
          await this.createPrePublishedResource.perform();
        const rslt = await this.store.createRecord('versioned-notulen', {
          zitting: this.model,
          content: content,
        });
        this.publishedResource = undefined;
        this.signedResources = [];
        this.notulen = rslt;
        this.validationErrors = errors;
      } catch (e) {
        console.error(e);
        this.errors = [e];
      }
    }
    if (this.status !== 'published') {
      const treatments = await this.fetchTreatments.perform();
      this.treatments = treatments;
    }
  });

  createPrePublishedResource = task(async () => {
    const id = this.model.id;
    const json = await this.publish.fetchJobTask.perform(
      `/prepublish/notulen/${id}`
    );
    return json.data.attributes;
  });

  fetchTreatments = task(async () => {
    const id = this.model.id;
    const response = await this.publish.fetchTreatmentPreviews(id);

    return response.map((res) => res.data.attributes);
  });

  createSignedResource = task(async () => {
    this.showSigningModal = false;
    const id = this.model.id;
    const taskId = await this.muTask.fetchTaskifiedEndpoint(
      `/signing/notulen/sign/${id}`,
      { method: 'POST' }
    );
    await this.muTask.waitForMuTaskTask.perform(taskId);
    this.signedResources = await this.store.query('signed-resource', {
      'filter[versioned-notulen][zitting][:id:]': this.model.id,
      include: 'gebruiker',
      sort: 'created-on',
    });
  });

  createPublishedResource = task(async () => {
    this.showPublishingModal = false;
    const id = this.model.id;
    const taskId = await this.muTask.fetchTaskifiedEndpoint(
      `/signing/notulen/publish/${id}`,
      {
        headers: { 'Content-Type': 'application/vnd.api+json' },
        body: JSON.stringify({
          'public-behandeling-uris': this.publicBehandelingUris,
        }),
        method: 'POST',
      }
    );
    await this.muTask.waitForMuTaskTask.perform(taskId);
    await this.loadNotulen.perform();
  });

  generateNotulenPreview = task(async () => {
    const meetingId = this.model.id;
    try {
      const json = await this.publish.createJobTask.perform(
        `/meeting-notes-previews`,
        {
          headers: { 'Content-Type': 'application/vnd.api+json' },
          body: JSON.stringify({
            data: {
              type: 'meeting-notes-previews',
              relationships: {
                publicTreatments: this.publicBehandelingUris.map((uri) => ({
                  data: {
                    id: uri,
                    type: 'treatments',
                  },
                })),
                meeting: {
                  data: {
                    id: meetingId,
                    type: 'meetings',
                  },
                },
              },
            },
          }),
          method: 'POST',
        }
      );
      const previewHtml = json.data.attributes.html;
      this.preview = previewHtml;
    } catch (e) {
      console.error(e);
      this.errors = [JSON.stringify(e)];
    }
  });

  get zittingWrapper() {
    if (this.notulen?.content) {
      const div = document.createElement('div');
      div.innerHTML = this.notulen.content;

      const bvapContainer = div.querySelector(
        "[property='http://mu.semte.ch/vocabularies/ext/behandelingVanAgendapuntenContainer']"
      );
      bvapContainer.innerHTML = '';
      bvapContainer.id = this.behandelingContainerId;

      return div.innerHTML;
    } else {
      return null;
    }
  }

  @action
  createSignPreview() {
    this.showSigningModal = true;
  }

  createPublishPreview = task(async () => {
    this.showPublishingModal = true;
    await this.generateNotulenPreview.perform();
  });

  updateNotulenPreview() {
    const div = document.createElement('div');
    div.innerHTML = this.notulen.content;

    const behandelingNodes = div.querySelectorAll(
      "[typeof='besluit:BehandelingVanAgendapunt']"
    );
    behandelingNodes.forEach((node) => {
      const uri =
        node.attributes['resource'] && node.attributes['resource'].value;
      if (this.publicBehandelingUris.includes(uri)) {
        node.classList.remove('behandeling-preview--niet-publiek');
      } else {
        node.classList.add('behandeling-preview--niet-publiek');
      }
    });

    this.notulen.set('body', div.innerHTML);
    this.allBehandelingPublic =
      this.treatments.length === this.publicBehandelingUris.length;
  }

  @action
  togglePublicationStatus(behandeling) {
    const uri = behandeling.behandeling;
    if (this.publicBehandelingUris.includes(uri))
      this.publicBehandelingUris.removeObject(uri);
    else this.publicBehandelingUris.pushObject(uri);
    this.updateNotulenPreview();
  }
  @action
  toggleAllPublicationStatus() {
    if (!this.allBehandelingPublic) {
      this.publicBehandelingUris = this.treatments.map(
        (behandeling) => behandeling.behandeling
      );
      this.updateNotulenPreview();
    } else {
      this.publicBehandelingUris = [];
      this.updateNotulenPreview();
    }
  }
}
