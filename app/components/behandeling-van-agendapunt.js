import Component from '@glimmer/component';
import {PUBLISHED_STATUS_ID} from 'frontend-gelinkt-notuleren/utils/constants';
import {tracked} from '@glimmer/tracking';
import {task} from 'ember-concurrency';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

/**
 * @typedef {Object} Args
 * @property {Behandeling} behandeling
 * @property {Array<Mandataris>} possibleParticipants
 * @property {BestuursOrgaan} bestuursorgaan
 * @property {Zitting} meeting
 * @property {boolean} readonly
 */
/** @extends {Component<Args>} */
export default class BehandelingVanAgendapuntComponent extends Component {
  @service store;
  @service router;

  @tracked openbaar;
  @tracked document;
  @tracked editor;
  @tracked participants = [];
  @tracked absentees = [];
  @tracked chairman;
  @tracked secretary;
  @tracked published = false;

  constructor() {
    super(...arguments);
    this.fetchParticipants.perform();
    this.getStatus.perform();
  }

  get editable() {
    return !(this.published || this.args.readOnly);
  }

  get documentContainer() {
    return this.args.behandeling.documentContainer;
  }

  get openbaar() {
    return this.args.behandeling.openbaar;
  }

  get defaultChairman() {
    return this.args.meeting.voorzitter;
  }

  get defaultSecretary() {
    return this.args.meeting.secretaris;
  }

  get defaultParticipants() {
    return this.args.meeting.aanwezigenBijStart;
  }

  get defaultAbsentees() {
    return this.args.meeting.afwezigenBijStart;
  }

  set openbaar(value) {
    this.args.behandeling.openbaar = value;
  }

  get hasParticipants() {
    return this.participants.length;
  }

  @task
  *getStatus() {
    const container = yield this.documentContainer;
    if (container.isLoaded) {
      const status = yield container.status;
      if (status.isLoaded) {
        if (status.id === PUBLISHED_STATUS_ID) {
          this.published = true;
        }
      }
    }
  }

  /**
   * @typedef {Object} ParticipantInfo
   * @property {Mandataris} chairman
   * @property {Mandataris} secretary
   * @property {Mandataris[]} participants
   * @property {Mandataris[]} absentees
   */

  /**
   * @param {ParticipantInfo} participants
   */
  @action
  async saveParticipants(participants) {
    this.args.behandeling.voorzitter = participants.chairman;
    this.chairman = participants.chairman;
    this.args.behandeling.secretaris = participants.secretary;
    this.secretary = participants.secretary;
    this.args.behandeling.aanwezigen = participants.participants;
    this.args.behandeling.afwezigen = participants.absentees;
    this.participants = participants.participants;
    this.absentees = participants.absentees;
    await this.args.behandeling.save();
  }

  @task
  *fetchParticipants() {
    const participantQuery = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-behandeling][:id:]': this.args.behandeling.get('id'),
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const absenteeQuery = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[afwezig-bij-behandeling][:id:]': this.args.behandeling.get('id'),
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    this.participants = yield this.store.query('mandataris', participantQuery);
    this.absentees = yield this.store.query('mandataris', absenteeQuery);
    this.chairman = yield this.args.behandeling.voorzitter;
    this.secretary = yield this.args.behandeling.secretaris;
  }

  @action
  async save(e) {
    e.stopPropagation();
    this.args.behandeling.openbaar = this.openbaar;
    const document = await this.saveEditorDocument.perform(this.document);
    this.document = document;
    await this.args.behandeling.save();
  }

  @action
  handleRdfaEditorInit(editor) {
    if (this.document.content) {
      editor.setHtmlContent(this.document.get('content'));
    }
    this.editor = editor;
  }

  @action
  toggleOpenbaar(e) {
    this.openbaar = e.target.checked;
  }

  @action
  goToEdit() {
    this.router.transitionTo(
      'meetings.edit.treatment',
      this.args.meeting.id,
      this.args.behandeling.id
    );
  }
}
