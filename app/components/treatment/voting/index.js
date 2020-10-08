import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
/** @typedef {import("../../../models/behandeling-van-agendapunt").default} Behandeling*/
/** @typedef {import("../../../models/bestuursorgaan").default} Bestuursorgaan*/

/**
 * @typedef {Object} Args
 * @property {Behandeling} behandeling
 * @property {Bestuursorgaan} bestuursorgaan
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingIndexComponent extends Component {
  @tracked showModal = false;
  @action
  toggleModal() {
    this.showModal = !this.showModal;
  }
}
