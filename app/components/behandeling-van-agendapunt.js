import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from '../utils/constants';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { use } from 'ember-could-get-used-to-this';
import { useTask, trackedFunction } from 'ember-resources';
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

  publishedRT = useTask(this, this.getStatus, () => [this.args.behandeling.id]);
  get published() {
    if (this.publishedRT.isFinished)
      return this.publishedRT.value;
    else
      return false;
  }

  participantsRT = useTask(this, this.fetchParticipants, () => [this.args.behandeling.id]);
  get participants() {
    if (this.participantsRT.isFinished)
      return this.participantsRT.value;
    else
      return [];
  }

  absenteesRT = useTask(this, this.fetchAbsentees, () => [this.args.behandeling.id]);
  get absentees() {
    if (this.absenteesRT.isFinished)
      return this.absenteesRT.value;
    else
      return [];
  }

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

  //hasParticipantsT = trackedFunction(this, async () => {
  //  await this.participants;
  //  return (this.participants.value.length > 0);
  //});

  get hasParticipants() {
    console.log("Asking hasParticipants", this.participants);
    return (this.participants.length > 0);
    //return this.hasParticipantsT.value;
  }

  get isLoading() {
    return (
      this.participantsRT.isRunning ||
      this.absenteesRT.isRunning ||
      this.meetingChairmanData.isRunning ||
      this.meetingSecretaryData.isRunning
    );
  }

  get chairman() {
    console.log("Asking chairman", this.args.behandeling.voorzitter);
    return this.args.behandeling.voorzitter;
  }

  get defaultChairman() {
    return this.meetingChairmanData.value;
  }

  get secretary() {
    return this.args.behandeling.secretaris;
  }

  get defaultSecretary() {
    return this.meetingSecretaryData.value;
  }

  @task
  *getStatus(behandelingId) {
    yield Promise.resolve();
    const behandeling = (yield this.store.query('behandeling-van-agendapunt', {
      'filter[:id:]': behandelingId,
      include: 'document-container.status',
    })).firstObject;

    if (behandeling) {
      const status = yield behandeling.get('documentContainer.status');
      const statusId = status.id;

      if (statusId === PUBLISHED_STATUS_ID) {
        return true;
      }
    }
    return false;
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
  *fetchParticipants(behandelingId) {
    console.log("Fetching participants for behandeling", behandelingId);
    const participantQuery = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[aanwezig-bij-behandeling][:id:]': behandelingId,
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    yield Promise.resolve();
    const participants = this.store.query('mandataris', participantQuery);
    console.log("Fetched participants", participants);
    return participants;
  }

  @task
  *fetchAbsentees(behandelingId) {
    const absenteeQuery = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[afwezig-bij-behandeling][:id:]': behandelingId,
      include: 'is-bestuurlijke-alias-van',
      page: { size: 100 }, //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    yield Promise.resolve();
    return this.store.query('mandataris', absenteeQuery);
  }

  @task
  *toggleOpenbaar(e) {
    const openbaar = e.target.checked;
    this.args.behandeling.openbaar = openbaar;
    yield this.args.behandeling.save();
  }
}
