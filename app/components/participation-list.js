import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

/**
 * @typedef {import("../models/mandataris").default} Mandataris
 * @typedef {import("../models/functionaris").default} Functionaris
 * @typedef {import("../models/bestuursorgaan").default} BestuursOrgaan
 * */

/**
 * @typedef {Object} Args
 * @property {Mandataris | null} [chairman]
 * @property {Mandataris | null} [defaultChairman]
 * @property {Functionaris | null} [secretary]
 * @property {Functionaris | null} [defaultSecretary]
 * @property {Array<Mandataris> | null} [participants]
 * @property {Array<Mandataris> | null} [defaultParticipants]
 * @property {Array<Mandataris> | null} [absentees]
 * @property {Array<Mandataris> | null} [defaultAbsentees]
 * @property {Array<Mandataris> | null} [possibleParticipants]
 *
 * @property {BestuursOrgaan} bestuursorgaan
 * @property {OnSave} onSave
 * @property {Zitting} meeting
 * @property {string} modalTitle
 * @property {boolean} readOnly
 * @property {boolean} [loading]
 */

/**
 * Manage participants, absentees, chairman and secretary.
 * This component expects its arguments to be resolved
 *
 * @extends {Component<Args>}
 */
export default class ParticipationListComponent extends Component {
  @service intl;

  @tracked popup = false;

  get secretary() {
    return this.args.secretary;
  }

  get chairman() {
    return this.args.chairman;
  }

  get defaultedChairman() {
    return this.chairman ?? this.args.defaultChairman;
  }

  get defaultedSecretary() {
    return this.secretary ?? this.args.defaultSecretary;
  }

  get participantsEmpty() {
    return !this.args.participants?.length && !this.args.absentees?.length;
  }

  get participants() {
    return this.args.participants;
  }

  get defaultedParticipants() {
    if (!this.participants || this.participantsEmpty) {
      return this.args.defaultParticipants;
    }
    return this.participants;
  }

  get absentees() {
    return this.args.absentees;
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

  get detailsListItems() {
    return [
      {
        label: this.intl.t('participation-list.voorzitter-label'),
        value: this.chairman?.get('isBestuurlijkeAliasVan.fullName'),
        pill: !this.chairman
          ? {
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('participation-list.voorzitter-error'),
            }
          : null,
      },
      {
        label: this.intl.t('participation-list.secretaris-label'),
        value: this.secretary?.get('isBestuurlijkeAliasVan.fullName'),
        pill: !this.secretary
          ? {
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('participation-list.secretaris-error'),
            }
          : null,
      },
      {
        label: this.intl.t('participation-list.present-label'),
        value: this.participants
          ?.map((m) => m.get('isBestuurlijkeAliasVan.fullName'))
          .join(', '),
        pill: !this.participants?.length
          ? {
              skin: 'warning',
              icon: 'alert-triangle',
              text: this.intl.t('participation-list.present-error'),
            }
          : null,
      },
      {
        label: this.intl.t('participation-list.not-present-label'),
        value:
          this.absentees
            ?.map((m) => m.get('isBestuurlijkeAliasVan.fullName'))
            .join(', ') || '',
      },
    ];
  }
}
