import { action } from '@ember/object';
import Component from '@glimmer/component';

/**
 * @typedef {Object} Args
 * @property {boolean} show
 * @property {() => void} [onCancel]
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingEditComponent extends Component {

  @action
  onCloseModal() {
    this.args.onCancel && this.args.onCancel();
  }
  @action
  save(){}
  @action
  cancel(){}
}
