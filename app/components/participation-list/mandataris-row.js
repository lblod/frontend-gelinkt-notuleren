import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

/**
 * @callback onToggleParticipation
 * @param {boolean} selected
 */

/**
 * @typedef {Object} Args
 * @property {Mandataris} mandataris
 * @property {Map<Mandataris, boolean>} selectedMandatees
 * @property {onToggleParticipation} onToggleParticipation
 */

 /** @extends {Component<Args>} */
export default class ParticipationListMandatarisRowComponent extends Component {
  @tracked selected;
  constructor() {
    super(...arguments);
    this.selected = this.args.selectedMandatees.get(this.args.mandataris);
  }
  @action
  toggle() {
    this.selected = !this.selected;
    this.args.onToggleParticipation(this.selected);
  }
}
