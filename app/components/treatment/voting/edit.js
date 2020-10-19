import { action } from "@ember/object";
import Component from "@glimmer/component";
import { inject as service } from "@ember/service";
/**
 * @typedef {import("../../../models/stemming").default} Stemming
 */

/**
 * @typedef {Object} Args
 * @property {boolean} show
 * @property {Stemming} stemming
 * @property {(Stemming) => void} [onSave]
 * @property {() => void} [onCancel]
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingEditComponent extends Component {

  @service editStemming;

  @action
  save() {
    this.args.onSave && this.args.onSave();
  }
  @action
  cancel() {
    this.args.onCancel && this.args.onCancel();

  }

}
