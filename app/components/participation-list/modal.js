import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { inject as service } from '@ember/service';

/** @typedef {import("../../models/mandataris").default} Mandataris */
/** @typedef {import("../../models/bestuursorgaan").default} BestuursOrgaan */

/** @callback onSave
 * @param {Object} info
 */

/**
 * @typedef {Object} Args
 * @property {Mandataris} chairman
 * @property {Mandataris} secretary
 * @property {boolean} show
 * @property {Function} onCloseModal
 * @property {onSave} onSave
 * @property {BestuursOrgaan} bestuursOrgaan
 * @property {Array<Mandataris>} participants
 * @property {Array<Mandataris>} absentees
 * @property {Array<Mandataris>} possibleParticipants
 * @property {Zitting} meeting
 */

/** @extends {Component<Args>} */
export default class ParticipationListModalComponent extends Component {
  @tracked chairman;
  @tracked secretary;
  @service store;
  selectedMandatees = new Map();

  constructor() {
    super(...arguments);
    this.chairman = this.args.chairman;
    this.secretary = this.args.secretary;
    this.generateSelected();
  }


  @action
  selectChairman(value) {
    this.chairman = value;
  }

  @action
  selectSecretary(value) {
    this.secretary = value;
  }

  @action
  insert(e) {
    e.preventDefault();
    const { participants, absentees } = this.collectParticipantsAndAbsentees();
    const info = {
      chairman: this.chairman,
      secretary: this.secretary,
      participants,
      absentees,
    };
    this.args.onSave(info);
    this.args.togglePopup(e);
  }

  /**
   * Convert from the two lists into a map which holds participation per mandatee
   */
  generateSelected() {
    const { participants, absentees, possibleParticipants } = this.args;

    if (participants && participants.length) {
      participants.forEach((mandataris) => {
        this.selectedMandatees.set(mandataris, true);
      });
    }

    if (absentees && absentees.length) {
      absentees.forEach((mandataris) => {
        this.selectedMandatees.set(mandataris, false);
      });
    }

    possibleParticipants.forEach((participant) => {
      if (!this.selectedMandatees.has(participant)) {
        this.selectedMandatees.set(participant, true);
      }
    });
  }

  /**
   * Convert from the map back to two lists
   * @return {{absentees: [], participants: []}}
   */
  collectParticipantsAndAbsentees() {
    const participants = [];
    const absentees = [];
    for (const [mandatee, participates] of this.selectedMandatees.entries()) {
      if (participates) {
        participants.push(mandatee);
      } else {
        absentees.push(mandatee);
      }
    }

    return { participants, absentees };
  }

  /**
   * Toggle the participation of a single mandataris
   * @param {Mandataris} mandataris
   * @param {boolean} selected
   */
  @action
  toggleParticipation(mandataris, selected) {
    this.selectedMandatees.set(mandataris, selected);
  }
}
