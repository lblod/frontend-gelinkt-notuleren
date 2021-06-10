import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import { inject as service } from '@ember/service';
import { localCopy } from 'tracked-toolbox';
import { Resource, use } from 'ember-could-get-used-to-this';

class ParticipationMap extends Resource {
  /**
   * @callback DependencyConfig
   * @returns {[Mandataris[], Mandataris[], Mandataris[]]}}
   */

  /**
   * @param {DependencyConfig} dependencies
   */
  // eslint-disable-next-line no-unused-vars
  constructor(dependencies) {
    super(...arguments);
  }

  /** @type {Map} */
  participationMap = tracked(Map);

  get value() {
    return this.participationMap;
  }

  setup() {
    this.participationMap.clear();
    const [participants, absentees, possibleParticipants] =
      this.args.positional;
    if (participants && absentees && possibleParticipants) {
      if (participants.length) {
        participants.forEach((mandataris) => {
          this.participationMap.set(mandataris, true);
        });
      }

      if (absentees.length) {
        absentees.forEach((mandataris) => {
          this.participationMap.set(mandataris, false);
        });
      }

      possibleParticipants.forEach((participant) => {
        if (!this.participationMap.has(participant)) {
          this.participationMap.set(participant, true);
        }
      });
    }
  }
}

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

  @use participationMap = new ParticipationMap(() => [
    this.args.participants,
    this.args.absentees,
    this.args.possibleParticipants,
  ]);

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

  get participants() {
    return this.args.possibleParticipants.map((participant) => [
      participant,
      this.participationMap.get(participant),
    ]);
  }

  /**
   * Convert from the map back to two lists
   * @return {{absentees: [], participants: []}}
   */
  collectParticipantsAndAbsentees() {
    const participants = [];
    const absentees = [];
    for (const [mandatee, participates] of this.participants) {
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
  toggleParticipant(mandataris) {
    console.log('TOGGLING');
    const participating = this.participationMap.get(mandataris);
    this.participationMap.set(mandataris, !participating);
  }
}
