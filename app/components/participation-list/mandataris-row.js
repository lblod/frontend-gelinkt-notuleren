import Component from '@glimmer/component';
import { action } from "@ember/object";

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
  get selected() {
    return this.args.selectedMandatees.get(this.args.mandataris);
  }
  @action
  toggle() {
    this.args.onToggleParticipation(!this.selected);
  }
}
