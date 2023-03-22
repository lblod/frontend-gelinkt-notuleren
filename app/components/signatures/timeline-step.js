import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { action } from '@ember/object';

/**
 * @typedef {Object} Args
 * @property {string} name Name of the kind of resource to sign/publish (e.g. 'agenda', 'besluitenlijst', ...
 * @property {Object} document Versioned document to be signed/published
 * @property {Object} mockDocument Preview of versioned document together with current document id
 * @property {Function} signing Function to trigger the signing of the document
 * @property {Function} publish Function to trigger the publication of the document
 * @property {Function} [print] Function to trigger the printing of the document
 * @property {boolean} isOpen Flag to trigger opening or closing the fold
 * */

/**
 * @extends {Component<Args>}
 */

export default class SignaturesTimelineStep extends Component {
  @service currentSession;
  @service intl;
  @service store;

  @tracked showSigningModal = false;
  @tracked showPublishingModal = false;
  @tracked isSignedByCurrentUser = true;
  @tracked signedResources = [];
  @tracked signingOrPublishing = false;

  publicationBaseUrl = ENV.publication.baseUrl;

  constructor(parent, args) {
    super(parent, args);
    this.initTask.perform();
    this.expandable = this.args.isOpen ? false : true;
  }

  get isPublished() {
    if (this.args.publishedResource) {
      return !!this.args.publishedResource.get('id');
    }
    return false;
  }

  get canPrint() {
    return this.args.print;
  }

  get signaturesCount() {
    return this.activeSignatures.length;
  }

  @restartableTask
  *initTask() {
    this.bestuurseenheid = this.currentSession.group;
    const currentUser = this.currentSession.user;
    let firstSignatureUser = null;
    if (this.args.signedResources) {
      const signedResources = yield this.args.signedResources;
      if (signedResources.length > 0) {
        this.signedResources = signedResources.sortBy('createdOn');
        firstSignatureUser = yield signedResources.firstObject.gebruiker;
      }
    }
    this.isSignedByCurrentUser = currentUser === firstSignatureUser;
  }

  get isAgenda() {
    return (
      this.args.name === 'ontwerpagenda' ||
      this.args.name === 'aanvullende agenda' ||
      this.args.name === 'spoedeisende agenda'
    );
  }

  get title() {
    return `Voorvertoning ${this.args.name}`;
  }

  get headerWithDefault() {
    return this.args.header || this.args.name;
  }

  get status() {
    if (this.isPublished) return 'published';
    if (this.signaturesCount === 1) return 'firstSignature';
    if (this.signaturesCount === 2) return 'secondSignature';
    return 'concept';
  }

  get handtekeningStatus() {
    if (this.signaturesCount === 1)
      return {
        label: this.intl.t('publish.need-second-signature'),
        color: 'warning',
      };
    if (this.signaturesCount === 2)
      return { label: this.intl.t('publish.signed'), color: 'action' };
    return { label: this.intl.t('publish.unsigned'), color: 'border' };
  }

  get voorVertoningStatus() {
    if (this.status === 'published')
      return { label: this.intl.t('publish.public-version'), color: 'action' };
    if (this.status === 'firstSignature') {
      return {
        label: this.intl.t('publish.need-second-signature'),
        color: 'success',
      };
    }
    if (this.status === 'secondSignature') {
      return { label: this.intl.t('publish.signed-version'), color: 'success' };
    }
    return { label: '' };
  }

  get algemeneStatus() {
    if (this.status === 'published')
      return { label: this.intl.t('publish.published'), color: 'action' };
    if (this.status === 'firstSignature')
      return {
        label: this.intl.t('publish.first-signature-obtained'),
        color: 'warning',
      };
    if (this.status === 'secondSignature')
      return { label: this.intl.t('publish.signed'), color: 'success' };
    if (this.status === 'concept')
      return { label: this.intl.t('publish.in-preparation') };
    return 'concept';
  }

  get iconName() {
    if (this.status === 'concept') return 'pencil';
    if (this.status === 'firstSignature' || this.status === 'secondSignature')
      return 'message';
    if (this.status === 'published') return 'check';

    return 'pencil';
  }

  @action
  async signDocument(signedId, oldSignedResources) {
    this.signingOrPublishing = true;
    this.showSigningModal = false;
    this.isSignedByCurrentUser = true;
    let signedResources = await this.args.signing(signedId);
    if (!signedResources) {
      signedResources = oldSignedResources;
    }
    this.signedResources = signedResources.sortBy('createdOn');
    const signedResource = signedResources.lastObject;
    let versionedResource;
    if (await signedResource.get('agenda')) {
      versionedResource = signedResource.get('agenda');
    } else if (await signedResource.get('versionedBesluitenLijst')) {
      versionedResource = signedResource.get('versionedBesluitenLijst');
    } else if (await signedResource.get('versionedNotulen')) {
      versionedResource = signedResource.get('versionedNotulen');
    } else if (await signedResource.get('versionedBehandeling')) {
      versionedResource = signedResource.get('versionedBehandeling');
    }
    const log = this.store.createRecord('publishing-log', {
      action: 'sign',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signedResource,
      zitting: await versionedResource.get('zitting'),
    });
    await log.save();
    this.signingOrPublishing = false;
  }

  @action
  async publishDocument(signedId) {
    this.signingOrPublishing = true;
    this.showPublishingModal = false;
    await this.args.publish(signedId);
    const publishedResource = this.args.publishedResource;
    let versionedResource;
    if (await publishedResource.get('agenda')) {
      versionedResource = publishedResource.get('agenda');
    } else if (await publishedResource.get('versionedBesluitenLijst')) {
      versionedResource = publishedResource.get('versionedBesluitenLijst');
    } else if (await publishedResource.get('versionedNotulen')) {
      versionedResource = publishedResource.get('versionedNotulen');
    } else if (await publishedResource.get('versionedBehandeling')) {
      versionedResource = publishedResource.get('versionedBehandeling');
    }
    const log = this.store.createRecord('publishing-log', {
      action: 'publish',
      user: this.currentSession.user,
      date: new Date(),
      publishedResource: publishedResource,
      zitting: versionedResource.get('zitting'),
    });
    await log.save();
    this.signingOrPublishing = false;
  }

  @action
  publish() {
    this.showPublishingModal = true;
  }

  get activeSignatures() {
    return this.signedResources.filter((signature) => !signature.deleted);
  }

  get deletedSignatures() {
    return this.signedResources.filter((signature) => signature.deleted);
  }

  get showDeletedSecondSignature() {
    if (!this.deletedSignatures.lastObject) {
      return false;
    }
    return (
      this.activeSignatures.firstObject.createdOn <
      this.deletedSignatures.lastObject.createdOn
    );
  }
}
