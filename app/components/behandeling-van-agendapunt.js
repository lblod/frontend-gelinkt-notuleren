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

  get openbaar() {
    return this.args.behandeling.openbaar;
  }

  set openbaar(value) {
    this.args.behandeling.openbaar = value;
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
  async saveParticipants({chairman, secretary, participants, absentees}) {
    this.chairman = chairman;
    this.args.behandeling.voorzitter = chairman;

    this.secretary = secretary;
    this.args.behandeling.secretaris = secretary;

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
