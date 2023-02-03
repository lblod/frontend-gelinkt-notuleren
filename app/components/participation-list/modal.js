import Component from '@glimmer/component';
import { action } from '@ember/object';
import { localCopy } from 'tracked-toolbox';
import { use } from 'ember-could-get-used-to-this';
import ParticipationMap from '../../helpers/participant-map';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

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
  @tracked error;
  @service intl;

  /** @type {Map} */
  @use participationMap = new ParticipationMap(() => ({
    named: {
      // we depend on the show state here to make sure that upon opening/closing the modal
      // we reset the state
      active: this.args.show,
      participants: this.args.participants,
      absentees: this.args.absentees,
      possibleParticipants: this.args.possibleParticipants,
    },
  }));

  /**
   * Get a list of possible mandatees with their participation
   *
   * We use possibleParticipants here to map over cause it's already sorted.
   * @returns {{person: Mandataris, participating: boolean}[]}
   */
  get participants() {
    return this.args.possibleParticipants.map((participant) => ({
      person: participant,
      participating: this.participationMap.get(participant),
    }));
  }

  @action
  selectChairman(value) {
    this.chairman = value;
    this.participationMap.set(value, true);
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
    this.error = undefined;
    const { participants, absentees } = this.collectParticipantsAndAbsentees();
    const info = {
      chairman: this.chairman,
      secretary: this.secretary,
      participants,
      absentees,
    };
    if (absentees.includes(this.chairman)) {
      this.error = this.intl.t(
        'participation-list-modal.chairman-absent-error'
      );
      return;
    }
    this.args.onSave(info);
    this.args.onCloseModal();
  }

  /**
   * Convert from the map back to two lists
   * @return {{absentees: [], participants: []}}
   */
  collectParticipantsAndAbsentees() {
    const participants = [];
    const absentees = [];
    for (const { person, participating } of this.participants) {
      if (participating) {
        participants.push(person);
      } else {
        absentees.push(person);
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
  toggleParticipant(mandataris, selected) {
    this.participationMap.set(mandataris, !selected);
  }

  @action
  onCancel() {
    this.chairman = this.args.chairman;
    this.secretary = this.args.secretary;
    this.args.onCloseModal();
  }
}
