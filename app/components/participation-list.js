import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
/**
 * @typedef {import("../models/mandataris").default} Mandataris
 * @typedef {import("../models/functionaris").default} Functionaris
 * @typedef {import("../models/bestuursorgaan").default} BestuursOrgaan
 * */

/**
 * @typedef {Object} Args
 * @property {Mandataris} [chairman]
 * @property {Mandataris} [defaultChairman]
 * @property {Functionaris} [secretary]
 * @property {Functionaris} [defaultSecretary]
 * @property {Array<Mandataris>} [participants]
 * @property {Array<Mandataris>} [defaultParticipants]
 * @property {Array<Mandataris>} [absentees]
 * @property {Array<Mandataris>} [defaultAbsentees]
 * @property {Array<Mandataris>} [possibleParticipants]
 *
 * @property {BestuursOrgaan} bestuursorgaan
 * @property {OnSave} onSave
 * @property {Zitting} meeting
 * @property {string} modalTitle
 * @property {boolean} readOnly
 */

/**
 * Manage participants, absentees, chairman and secretary.
 * This component expects its arguments to be resolved
 *
 * @extends {Component<Args>}
 */
export default class ParticipationListComponent extends Component {
  @tracked popup = false;

  @service store;

  get chairman() {
    return this.args.chairman;
  }

  get defaultedChairman() {
    return this.chairman ?? this.args.defaultChairman;
  }

  get secretary() {
    return this.args.secretary;
  }

  get defaultedSecretary() {
    return this.secretary ?? this.args.defaultSecretary;
  }

  get participantsEmpty() {
    return !this.args.participants?.length && !this.args.absentees?.length;
  }

  get participants() {
    return this.args.participants?.sortBy('isBestuurlijkeAliasVan.achternaam');
  }

  get defaultedParticipants() {
    if (!this.participants || this.participantsEmpty) {
      return this.args.defaultParticipants;
    }
    return this.participants;
  }

  get absentees() {
    return this.args.absentees?.sortBy('isBestuurlijkeAliasVan.achternaam');
  }

  get defaultedAbsentees() {
    if (!this.absentees || this.participantsEmpty) {
      return this.args.defaultAbsentees;
    }
    return this.absentees;
  }

  @action
  togglePopup() {
    this.popup = !this.popup;
  }
}
