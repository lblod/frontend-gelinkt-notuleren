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
  /** @type {boolean} */
  @tracked public
  /** @type {string} */
  @tracked gevolg

  constructor(parent, args) {
    super(parent, args);
    this.stemming = this.args.stemming;
    this.onderwerp = this.args.stemming.onderwerp;
    this.public = this.args.stemming.geheim;
    this.gevolg = this.args.stemming.gevolg;
  }

  @action
  onCloseModal() {
    this.args.onCancel && this.args.onCancel();
  }
  @action
  save(){
    this.stemming.onderwerp = this.onderwerp;
    this.stemming.geheim = this.public;
    this.stemming.gevolg = this.gevolg;
    this.args.onSave && this.args.onSave(this.stemming);
  }
  @action
  cancel(){}
}
