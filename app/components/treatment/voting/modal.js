import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";
import { task, restartableTask } from "ember-concurrency";
/** @typedef {import("../../../models/behandeling-van-agendapunt").default} Behandeling*/
/** @typedef {import("../../../models/bestuursorgaan").default} Bestuursorgaan*/
/** @typedef {import("../../../models/stemming").default} Stemming*/

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
  /** @type {Stemming} */
  @service store;
  @service editStemming;

  constructor(parent, args) {
    super(parent, args);
    this.fetchStemmingen.perform();
  }

  @restartableTask
  /** @type {import("ember-concurrency").Task} */
  fetchStemmingen = function* () {
    this.stemmingen = (yield this.args.behandeling.stemmingen).sortBy('position');
  };

  @task
  /** @type {import("ember-concurrency").Task} */
  saveStemming = function* () {
    const isNew = this.editStemming.stemming.isNew;
    if (isNew) {
      this.editStemming.stemming.position = this.args.behandeling.stemmingen.length;
      this.args.behandeling.stemmingen.pushObject(this.editStemming.stemming);
      this.args.behandeling.save();
    }
    yield this.editStemming.saveTask.perform();
    yield this.fetchStemmingen.perform();
    this.onCancelEdit();
  };


  @task
  /** @type {import("ember-concurrency").Task} */
  addStemming =
    /** @this {TreatmentVotingModalComponent} */
    function* () {
      const richTreatment = yield this.store.query("behandeling-van-agendapunt", {
        "filter[:id:]": this.args.behandeling.id,
        include: "aanwezigen.bekleedt.bestuursfunctie"
      });
      const participants = richTreatment.firstObject.aanwezigen;

      const stemmingToEdit = this.store.createRecord("stemming", {
        onderwerp: "",
        geheim: false,
        aantalVoorstanders: 0,
        aantalTegenstanders: 0,
        aantalOnthouders: 0,
        gevolg: "",
      });
      this.editMode = true;
      stemmingToEdit.aanwezigen.pushObjects(participants);
      stemmingToEdit.stemmers.pushObjects(participants);
      this.editStemming.stemming = stemmingToEdit;
    };
  @action
  toggleEditStemming(stemming) {
    this.editStemming.stemming = stemming;
    this.editMode = true;
  }
  @task
  removeStemming = function* (stemming) {
    stemming.deleteRecord();
    yield stemming.save();
  }
  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming.rollbackAttributes();
    this.editStemming.stemming = null;
  }
}
