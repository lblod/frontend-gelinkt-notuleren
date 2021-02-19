import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

/**
 * @typedef {Object} Args
 * @property {Mandataris} chairman
 * @property {Mandataris} secretary
 * @property {Mandataris} [defaultSecretary]
 * @property {Mandataris} [defaultChairman]
 *
 * @property {BestuursOrgaan} bestuursorgaan
 * @property {Array<Mandataris>} possibleParticipants
 * @property {Array<Mandataris>} aanwezigenBijStart
 * @property {Array<Mandataris>} afwezigenBijStart
 * @property {Function} onSave
 * @property {Zitting} meeting
 * @property {string} modalTitle
 */

 /** @extends {Component<Args>} */
export default class ParticipationListComponent extends Component {
  @tracked popup = false;
  @tracked info;
  @tracked chairman;
  @tracked secretary;

  @service store;

  constructor() {
    super(...arguments);
    this.chairman = this.args.chairman ? this.args.chairman : this.args.defaultChairman;
    this.secretary = this.args.secretary ? this.args.secretary : this.args.defaultSecretary;
  }

  get aanwezigenBijStart() {
    return this.args.aanwezigenBijStart ?? [];
  }
   get afwezigenBijStart() {
     return this.args.afwezigenBijStart ?? [];
   }

  // this is only called after loading has finished
  get hasParticipationInfo() {
    return Boolean(this.aanwezigenBijStart.length > 0 || this.args.voorzitter || this.args.secretaris);
  }

  get mandateesPresent(){
    const sorted=this.aanwezigenBijStart.sortBy('isBestuurlijkeAliasVan.achternaam');
    return sorted;
  }
  get mandateesNotPresent() {
    const sorted = this.afwezigenBijStart.sortBy("isBestuurlijkeAliasVan.achternaam");
    return sorted;
  }

  @action
  togglePopup(e) {
    if(e) {
      e.preventDefault();
    }
    this.popup = !this.popup;
  }
}
