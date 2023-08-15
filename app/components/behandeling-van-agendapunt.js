import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from '../utils/constants';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { service } from '@ember/service';
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
  get behandeling() {
    return this.args.behandeling;
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
  get participants() {
    return this.behandeling.sortedParticipants ?? [];
  }
  get absentees() {
    return this.behandeling.sortedAbsentees ?? [];
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

  getStatus = task(async () => {
    if (this.behandeling) {
      const container = await this.behandeling.documentContainer;
      const status = await container.status;
      const statusId = status.id;

      if (statusId === PUBLISHED_STATUS_ID) {
        this.published = true;
      }
    }
  });

  /**
   * @param {ParticipantInfo} info
   */
  @action
  async saveParticipants({ chairman, secretary, participants, absentees }) {
    this.behandeling.voorzitter = chairman;
    this.chairman = chairman;
    this.behandeling.secretaris = secretary;
    this.secretary = secretary;

    this.behandeling.aanwezigen = participants;

    this.absentees = absentees;
    this.behandeling.afwezigen = absentees;

    await this.args.behandeling.save();
  }

  fetchParticipants = task(async () => {
    this.chairman = await this.behandeling.voorzitter;
    this.secretary = await this.behandeling.secretaris;
  });

  toggleOpenbaar = task(async (e) => {
    const openbaar = e.target.checked;
    this.behandeling.openbaar = openbaar;
    await this.behandeling.save();
  });
}
