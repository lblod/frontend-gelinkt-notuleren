import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import Component from '@glimmer/component';
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
  /** @type {Stemming} */
  @tracked stemming
  /** @type {string} */
  @tracked onderwerp

  constructor(parent, args) {
    super(parent, args);
    this.stemming = this.args.stemming;
    this.onderwerp = this.args.stemming.onderwerp;
  }

  @action
  onCloseModal() {
    this.args.onCancel && this.args.onCancel();
  }
  @action
  save(){
    this.stemming.onderwerp = this.onderwerp;
    this.args.onSave && this.args.onSave(this.stemming);
  }
  @action
  cancel(){}
}
