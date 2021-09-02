import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from '../utils/constants';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { use } from 'ember-could-get-used-to-this';
import RelationshipResource from '../helpers/relationship-resource';

/** @typedef {import("../models/mandataris").default} Mandataris  */
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
  @tracked document;
  @tracked editor;
  @tracked participants = [];
  @tracked absentees = [];
  @tracked published = false;
  @tracked chairman;
  @tracked secretary;
  /** @type {RelationshipResourceValue} */
  @use meetingChairmanData = new RelationshipResource(() => [
    this.args.meeting,
    'voorzitter',
  ]);
  /** @type {RelationshipResourceValue} */
  @use meetingSecretaryData = new RelationshipResource(() => [
    this.args.meeting,
    'secretaris',
  ]);
  /** @type {RelationshipResourceValue} */
  @use meetingParticipantsData = new RelationshipResource(() => [
    this.args.meeting,
    'aanwezigenBijStart',
  ]);
  /** @type {RelationshipResourceValue} */
  @use meetingAbsenteeData = new RelationshipResource(() => [
    this.args.meeting,
    'afwezigenBijStart',
  ]);

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

  set openbaar(value) {
    this.args.behandeling.openbaar = value;
  }

  get defaultParticipants() {
    return this.meetingParticipantsData.value;
  }

  get defaultAbsentees() {
    return this.meetingAbsenteeData.value;
  }

  get hasParticipants() {
    return this.participants.length;
  }

  get isLoading() {
    return (
      this.fetchParticipants.isRunning ||
      this.meetingChairmanData.isRunning ||
      this.meetingSecretaryData.isRunning
    );
  }

  get defaultChairman() {
    return this.meetingChairmanData.value;
  }

  get defaultSecretary() {
    return this.meetingSecretaryData.value;
  }

  @task
  *getStatus() {
    const behandeling=(yield this.store.query("behandeling-van-agendapunt", {
      "filter[:id:]": this.args.behandeling.id,
      include: 'document-container.status'
    })).firstObject;

    if(behandeling){
      const status = yield behandeling.get('documentContainer.status');
      const statusId = status.id;

      if(statusId === PUBLISHED_STATUS_ID){
        this.published = true;
      }
    }
  }

  /**
   * @param {ParticipantInfo} info
   */
  @action
  async saveParticipants({ chairman, secretary, participants, absentees }) {
    this.args.behandeling.voorzitter = chairman;
    this.chairman = chairman;
    this.args.behandeling.secretaris = secretary;
    this.secretary = secretary;

    this.participants = participants;
    this.args.behandeling.aanwezigen = participants;

    this.absentees = absentees;
    this.args.behandeling.afwezigen = absentees;

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

  @task
  *toggleOpenbaar(e) {
    const openbaar = e.target.checked;
    this.args.behandeling.openbaar = openbaar;
    yield this.args.behandeling.save();
  }
}
