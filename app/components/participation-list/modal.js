import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { inject as service } from '@ember/service';
import { localCopy } from 'tracked-toolbox';

/** @typedef {import("../../models/mandataris").default} Mandataris */
/** @typedef {import("../../models/functionaris").default} Functionaris */
/** @typedef {import("../../models/bestuursorgaan").default} BestuursOrgaan */

/**
 * @typedef {Object} ParticipantInfo
 * @property {Mandataris} chairman
 * @property {Functionaris} secretary
 * @property {Mandataris[]} participants
 * @property {Mandataris[]} absentees
 */

/**
 * @callback OnSave
 * @param {ParticipantInfo} info
 */

/**
 * @typedef {Object} Args
 * @property {Mandataris} chairman must be resolved
 * @property {Mandataris} secretary must be resolved
 * @property {boolean} show
 * @property {Function} onCloseModal
 * @property {OnSave} onSave
 * @property {BestuursOrgaan} bestuursOrgaan
 * @property {Array<Mandataris>} participants
 * @property {Array<Mandataris>} absentees
 * @property {Array<Mandataris>} possibleParticipants
 * @property {Zitting} meeting
 */

/** @extends {Component<Args>} */
export default class ParticipationListModalComponent extends Component {
  @localCopy('args.chairman') chairman;
  @localCopy('args.secretary') secretary;
  @service store;
  @tracked selectedMandatees = new Map();

  constructor() {
    super(...arguments);
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

  /**
   * Save the selected participant config and close the modal
   */
  @action
  insert() {
    const { participants, absentees } = this.collectParticipantsAndAbsentees();
    const info = {
      chairman: this.chairman,
      secretary: this.secretary,
      participants,
      absentees,
    };
    this.args.onSave(info);
    this.args.onCloseModal();
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
    this.selectedMandatees = this.selectedMandatees;
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
