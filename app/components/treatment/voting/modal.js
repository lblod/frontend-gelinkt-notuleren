import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import {restartableTask} from "ember-concurrency-decorators";
/** @typedef {import("../../../models/behandeling-van-agendapunt").default} Behandeling*/
/** @typedef {import("../../../models/bestuursorgaan").default} Bestuursorgaan*/

/**
 * @typedef {Object} Args
 * @property {Behandeling} behandeling
 * @property {Bestuursorgaan} bestuursorgaan
 * @property {boolean} show
 * @property {() => void} onClose
 */

/** @extends {Component<Args>} */
export default class TreatmentVotingModalComponent extends Component {
  @tracked stemmingen;
  @tracked create = false;
  @tracked edit = false;
  @tracked editMode = false;
  @tracked stemmingToEdit;

  constructor(parent, args) {
    super(parent, args);
    this.fetchStemmingen.perform();
  }

  @restartableTask
  /** @type {import("ember-concurrency").Task} */
  fetchStemmingen = function * () {
    this.stemmingen = yield this.args.behandeling.stemmingen;
  }

  @action
  addStemming(){
    this.editMode = true}
  @action
  editStemming(stemming){}
  @action
  removeStemming(stemming){}
  @action
  onCancelEdit(){
    this.editMode = false;
  }
}
