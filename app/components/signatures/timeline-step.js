import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { task, restartableTask } from 'ember-concurrency';
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

  @tracked showSigningModal = false;
  @tracked showPublishingModal = false;
  @tracked isSignedByCurrentUser = true;
  @tracked signedResources = [];

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
    return this.signedResources.length;
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
    if (this.status === 'concept') return { label: this.intl.t('publish.in-preparation') };
    return 'concept';
  }

  get iconName() {
    if (this.status === 'concept') return 'pencil';
    if (this.status === 'firstSignature' || this.status === 'secondSignature')
      return 'message';
    if (this.status === 'published') return 'check';

    return 'pencil';
  }

  @task
  *signDocument(signedId) {
    this.showSigningModal = false;
    this.isSignedByCurrentUser = true;
    yield this.args.signing(signedId);
    const signedResources = yield this.args.signedResources;
    this.signedResources = signedResources.sortBy('createdOn');
  }

  @task
  *publishDocument(signedId) {
    this.showPublishingModal = false;
    yield this.args.publish(signedId);
  }

  @action
  publish() {
    this.showPublishingModal = true;
  }
}
