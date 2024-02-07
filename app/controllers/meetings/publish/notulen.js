import { service } from '@ember/service';
import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { isEmpty } from '@ember/utils';

export default class MeetingsPublishNotulenController extends Controller {
  @service store;
  @service publish;
  @service muTask;
  @service currentSession;
  @service intl;

  behandelingContainerId = 'behandeling-van-agendapunten-container';
  @tracked notulen;
  @tracked fullNotulen;
  @tracked errors;
  @tracked validationErrors;
  @tracked signedResources = [];
  @tracked hasDeletedSignedResources = false;
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
    // This is a kind of a workaround/trick
    // if you look at the template, the in-element helper that uses this getter
    // already conditionally renders on loadNotulen.isIdle, so you'd expect this
    // to not be necessary here,
    // but it seems in-element doesn't retrigger this getter
    // when the block it's in goes from unrendered to rendered.
    // As a result, the children are rendered in a containerElement that is no longer
    // attached to the dom. So we force an extra dependency here to make sure the getter
    // retriggers.
    if (this.loadNotulen.isIdle) {
      return document.getElementById(this.behandelingContainerId);
    } else {
      return null;
    }
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

  get statusLabel() {
    switch (this.status) {
      case 'published':
        return this.intl.t('publish.published');
      case 'firstSignature':
        return this.intl.t('publish.first-signature-obtained');
      case 'secondSignature':
        return this.intl.t('publish.signed');
      default:
        return this.intl.t('publish.in-preparation');
    }
  }

  get loading() {
    return (
      this.createSignedResource.isRunning ||
      this.deleteSignatureTask.isRunning ||
      this.loadNotulen.isRunning
    );
  }

  get isPublished() {
    return !!this.publishedResource;
  }

  async loadSignedResources(versionedNotulenId) {
    const signedNonDeletedResources = await this.store.query(
      'signed-resource',
      {
        'filter[versioned-notulen][:id:]': versionedNotulenId,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
        sort: 'created-on',
      },
    );

    const signedDeletedResources = await this.store.query('signed-resource', {
      'filter[versioned-notulen][:id:]': versionedNotulenId,
      'filter[deleted]': true,
      sort: 'created-on',
    });

    return { signedDeletedResources, signedNonDeletedResources };
  }

  loadNotulen = task(async () => {
    // this file is incredibly stateful, so we need to do silly things
    // like this
    this.publishedResource = undefined;
    this.signedResources = [];

    // published notulen have kind "public", meaning they only
    // contain the public content
    const publicNotulen = (
      await this.store.query('versioned-notulen', {
        'filter[zitting][:id:]': this.model.id,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
        'filter[kind]': 'public',
        include: 'published-resource.gebruiker',
      })
    )[0];

    if (publicNotulen) {
      // the notulen have been published
      const publishedResource = await publicNotulen.publishedResource;
      if (publishedResource) {
        // the else branch _should_ never happen, I don't know what to do
        // if it does
        this.publishedResource = publishedResource;
      }
      this.publicBehandelingUris = publicNotulen.publicBehandelingen || [];
      if (isEmpty(publicNotulen.content)) {
        const fileMeta = await publicNotulen.file;
        publicNotulen.content = await (await fetch(fileMeta.downloadLink)).text();
      }
      this.notulen = publicNotulen;
    } else {
      try {
        // generate a rendered document
        const { content, errors } =
          await this.createPrePublishedResource.perform();
        // save it in a "placeholder" versioned-notulen instance
        // note: this instance will never actually be saved using ember
        // data, as we call the service that creates the final entry
        // in the database. This is just done here for ????? reasons
        // that predate me visiting this file.
        const rslt = await this.store.createRecord('versioned-notulen', {
          zitting: this.model,
          content: content,
          kind: 'public',
        });

        this.notulen = rslt;
        this.validationErrors = errors;
      } catch (e) {
        console.error(e);
        this.errors = [e];
      }
    }
    // signed notulen have kind "full", meaning they always
    // contain the full content.
    const fullNotulen = (
      await this.store.query('versioned-notulen', {
        'filter[zitting][:id:]': this.model.id,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
        'filter[kind]': 'full',
      })
    )[0];

    if (fullNotulen) {
      // load the signed resources. NOTE: we can't use relationships here,
      // because we need to filter on the deleted property
      const { signedNonDeletedResources, signedDeletedResources } =
        await this.loadSignedResources(fullNotulen.id);

      // store the rest of the needed state
      this.signedResources = signedNonDeletedResources;
      this.hasDeletedSignedResources =
        !!signedDeletedResources.toArray().length;
      this.fullNotulen = fullNotulen;
    } else {
      // this means there are no signatures
      try {
        // we generate another preview, independent from the one for
        // publishing, so we are sure we're showing the user the actual
        // content they will be signing, regardless of the publication state.
        // e.g.: a document is published with agenda item contents kept private
        // -> this will still show all the contents as they always sign everything
        const { content, errors } =
          await this.createPrePublishedResource.perform();
        const rslt = await this.store.createRecord('versioned-notulen', {
          zitting: this.model,
          content: content,
          kind: 'full',
        });
        this.fullNotulen = rslt;
        this.validationErrors = errors;
      } catch (e) {
        console.error(e);
        this.errors = [e];
      }
    }

    // publishing notulen also auto-publishes extracts of the agenda items
    // marked as "public content", so we refresh those
    if (this.status !== 'published') {
      const treatments = await this.fetchTreatments.perform();
      this.treatments = treatments;
    }
  });

  createPrePublishedResource = task(async () => {
    const id = this.model.id;
    const json = await this.publish.fetchJobTask.perform(
      `/prepublish/notulen/${id}`,
    );
    return json.data.attributes;
  });

  fetchTreatments = task(async () => {
    const id = this.model.id;
    const response = await this.publish.fetchTreatmentPreviews(id);

    return response.map((res) => res.data.attributes);
  });
  deleteSignatureTask = task(async (signature) => {
    signature.deleted = true;
    await signature.save();
    const log = this.store.createRecord('publishing-log', {
      action: 'delete-signature',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signature,
      zitting: await this.notulen.zitting,
    });
    await log.save();

    // not a mistake
    // at this point, the signature is marked as deleted but the model has not yet reloaded,
    // so it is still in the signedResources array.
    // we could reload the model here, but then we're reloading twice in one call, which seems unnecessary
    if (this.signedResources.length === 1) {
      this.notulen.deleted = true;
      await this.notulen.save();
    }
    await this.loadNotulen.perform();
  });

  createSignedResource = task(async () => {
    this.showSigningModal = false;
    const id = this.model.id;
    const taskId = await this.muTask.fetchTaskifiedEndpoint(
      `/signing/notulen/sign/${id}`,
      { method: 'POST' },
    );
    await this.muTask.waitForMuTaskTask.perform(taskId);
    await this.loadNotulen.perform();
    const signedResources = this.signedResources;
    const signedResource = signedResources[signedResources.length - 1];
    const versionedResource = await signedResource.versionedNotulen;

    const log = this.store.createRecord('publishing-log', {
      action: 'sign',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signedResource,
      zitting: await versionedResource.zitting,
    });
    await log.save();
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
      },
    );
    await this.muTask.waitForMuTaskTask.perform(taskId);
    await this.loadNotulen.perform();
    const publishedResource = this.publishedResource;
    const versionedResource = this.notulen;

    const log = this.store.createRecord('publishing-log', {
      action: 'publish',
      user: this.currentSession.user,
      date: new Date(),
      publishedResource: publishedResource,
      zitting: await versionedResource.zitting,
    });
    await log.save();
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
        },
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
        "[property='http://mu.semte.ch/vocabularies/ext/behandelingVanAgendapuntenContainer']",
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
      "[typeof='besluit:BehandelingVanAgendapunt']",
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
        (behandeling) => behandeling.behandeling,
      );
      this.updateNotulenPreview();
    } else {
      this.publicBehandelingUris = [];
      this.updateNotulenPreview();
    }
  }
}
