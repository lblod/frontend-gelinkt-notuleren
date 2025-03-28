import { action } from '@ember/object';
import Component from '@glimmer/component';
import { service } from '@ember/service';
/**
 * @import Stemming from 'frontend-gelinkt-notuleren/models/stemming'
 * @import BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan'
 */

/**
 * @typedef {Object} Args
 * @property {boolean} [show]
 * @property {boolean} [saving]
 * @property {BestuursorgaanModel} bestuursorgaan
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

  /**
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  @action
  handleVotingSubjectChange(event) {
    this.editStemming.stemming.onderwerp = event.target.value;
  }

  /**
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  @action
  handleVotingConsequencesChange(event) {
    this.editStemming.stemming.gevolg = event.target.value;
  }
}
