import Component from "@glimmer/component";
import {inject as service} from '@ember/service';
import {task, restartableTask} from 'ember-concurrency-decorators';
import {tracked} from "@glimmer/tracking";
/**
 * @typedef {Object} Args
 * @property {string} name Name of the kind of resource to sign/publish (e.g. 'agenda', 'besluitenlijst', ...
 * @property {string} step Name of the current selected step
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

  @tracked
  showSigningModal = false;
  @tracked
  showPublishingModal = false;
  @tracked
  isSignedByCurrentUser = true;

  constructor(parent, args) {
    super(parent, args);
    this.initTask.perform();
  }

  get isPublished() {
    return !!this.args.document.publishedResource.id;
  }

  get signaturesCount() {
    return this.args.document.signedResources.length;

  }

  @restartableTask
  * initTask() {
    this.bestuurseenheid = yield this.currentSession.group;
    const currentUser = yield this.currentSession.user;
    let firstSignatureUser = null;
    if (this.args.document) {
      const signedResources = yield this.args.document.signedResources;
      if (signedResources.length > 0) {
        firstSignatureUser = yield signedResources[0].gebruiker;
      }
    }
    this.isSignedByCurrentUser = currentUser === firstSignatureUser;

  }

  get isAgenda() {
    return (this.args.name === 'ontwerpagenda') || (this.args.name === 'aanvullende agenda') || (this.args.name === 'spoedeisende agenda');
  }

  get title() {
    return `Voorvertoning ${this.args.name}`;
  }


  get headerWithDefault() {
    return this.args.header || this.args.name;
  }

  get status() {
    if (this.isPublished)
      return 'published';
    if (this.signaturesCount === 1)
      return 'firstSignature';
    if (this.signaturesCount === 2)
      return 'secondSignature';
    return 'concept';
  }

  get handtekeningStatus() {

    if (this.signaturesCount === 1)
      return {label: 'Tweede ondertekening vereist', color: 'primary-yellow'};
    if (this.signaturesCount === 2)
      return {label: 'Ondertekend', color: 'primary-blue'};
    return {label: 'Niet ondertekend'};
  }

  get voorVertoningStatus() {
    if (this.status === 'published')
      return {label: 'Publieke versie', color: 'primary-blue'};
    if (this.status === 'firstSignature' || this.status === 'secondSignature')
      return {label: 'Ondertekende versie', color: 'primary-yellow'};
    return {label: 'Meest recente versie'};

  }

  get algemeneStatus() {
    if (this.status === 'published')
      return {label: 'Gepubliceerd', color: 'primary-blue'};
    if (this.status === 'firstSignature')
      return {label: 'Eerste ondertekening verkregen', color: 'primary-yellow'};
    if (this.status === 'secondSignature')
      return {label: 'Getekend', color: 'primary-yellow'};
    if (this.status === 'concept')
      return {label: 'Concept'};
    return 'concept';
  }


  get iconName() {
    if (this.status === 'concept')
      return 'vi-edit';
    if (this.status === 'firstSignature' || this.status === 'secondSignature')
      return 'vi-clock';
    if (this.status === 'published')
      return 'vi-news';

    return 'vi-edit';
  }

  @task
  * signDocument(signedId) {
    this.showSigningModal = false;
    this.isSignedByCurrentUser = true;
    yield this.args.signing(signedId);
  }

  @task
  * publishDocument(signedId) {
    this.showPublishingModal = false;
    yield this.args.publish(signedId);
  }
}
