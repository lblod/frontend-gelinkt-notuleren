import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from '../utils/constants';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { use } from 'ember-could-get-used-to-this';
import RelationshipResource from '../helpers/relationship-resource';
import { trackedFunction } from 'ember-resources/util/function';

/** @typedef {import("../models/mandataris").default} Mandataris  */
/** @typedef {import("../models/behandeling-van-agendapunt").default} Behandeling  */
/**
 * @typedef {Object} Args
 * @property {Behandeling|undefined} behandeling
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
  @tracked published = false;
  @tracked chairman;
  @tracked secretary;

  @tracked editMode = false;
  @service editStemming;

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
  attachmentData = trackedFunction(this, async () => {
    const container = await this.behandeling?.documentContainer;
    const attachments = await container?.attachments;
    return attachments;
  });

  get attachments() {
    return this.attachmentData.value ?? [];
  }

  get behandeling() {
    return this.args.behandeling;
  }

  get stemmingen() {
    return this.args.behandeling.sortedVotings ?? [];
  }

  get editable() {
    return !(this.published || this.args.readOnly);
  }

  get canEditParticipants() {
    if (this.behandeling) {
      return this.behandeling.stemmingen.length === 0;
    } else {
      return false;
    }
  }

  get openbaar() {
    return this.behandeling?.openbaar;
  }

  set openbaar(value) {
    if (this.behandeling) {
      this.behandeling.openbaar = value;
    }
  }

  get defaultParticipants() {
    return this.meetingParticipantsData.value;
  }

  get defaultAbsentees() {
    return this.meetingAbsenteeData.value;
  }
  get participants() {
    return this.behandeling?.sortedParticipants ?? [];
  }
  get absentees() {
    return this.behandeling?.sortedAbsentees ?? [];
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
    const container = await this.behandeling?.documentContainer;
    if (container) {
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
    if (this.behandeling) {
      this.behandeling.voorzitter = chairman;
      this.chairman = chairman;
      this.behandeling.secretaris = secretary;
      this.secretary = secretary;

      this.behandeling.aanwezigen = participants;

      this.behandeling.afwezigen = absentees;

      await this.behandeling.save();
    }
  }

  fetchParticipants = task(async () => {
    if (this.behandeling) {
      this.chairman = await this.behandeling.voorzitter;
      this.secretary = await this.behandeling.secretaris;
    }
  });

  toggleOpenbaar = task(async (e) => {
    if (this.behandeling) {
      const openbaar = e.target.checked;
      this.behandeling.openbaar = openbaar;
      await this.behandeling.save();
    }
  });

  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming.rollbackAttributes();
    this.editStemming.stemming = null;
  }

  saveStemming = task(async () => {
    const isNew = this.editStemming.stemming.isNew;

    if (isNew) {
      this.editStemming.stemming.position = this.stemmingen.length;
      this.editStemming.stemming.behandelingVanAgendapunt =
        this.args.behandeling;
    }
    await this.editStemming.saveTask.perform();
    this.onCancelEdit();
  });

  addStemming = task(async () => {
    // high pagesize is set on the model, so this is fine
    const participants = await this.args.behandeling.aanwezigen;

    const stemmingToEdit = this.store.createRecord('stemming', {
      onderwerp: '',
      geheim: false,
      aantalVoorstanders: 0,
      aantalTegenstanders: 0,
      aantalOnthouders: 0,
      gevolg: '',
    });
    this.editMode = true;
    stemmingToEdit.aanwezigen.pushObjects(participants);
    stemmingToEdit.stemmers.pushObjects(participants);
    this.editStemming.stemming = stemmingToEdit;
  });
}
