import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";
import { task, restartableTask } from "ember-concurrency-decorators";
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
    this.stemmingen = yield this.args.behandeling.stemmingen;
  };

  @task
  /** @type {import("ember-concurrency").Task} */
  saveStemming = function* () {
    const isNew = this.editStemming.stemming.isNew;
    yield this.editStemming.saveTask.perform();
    if (isNew) {
      this.args.behandeling.stemmingen.pushObject(this.editStemming.stemming);
      this.args.behandeling.save();
    }
    yield this.fetchStemmingen.perform();
    this.onCancelEdit();
  };

  @task
  /** @type {import("ember-concurrency").Task} */
  addStemming =
    /** @this {TreatmentVotingModalComponent} */
    function* () {
      const aanwezigen = yield this.args.behandeling.aanwezigen;

      const stemmingToEdit = this.store.createRecord("stemming", {
        onderwerp: {
          content: "",
          language: "nl",
        },
        geheim: false,
        aantalVoorstanders: 0,
        aantalTegenstanders: 0,
        aantalOnthouders: 0,
        gevolg: {
          content: "",
          language: "nl",
        },
      });
      this.editMode = true;
      stemmingToEdit.aanwezigen.pushObjects(aanwezigen);
      stemmingToEdit.stemmers.pushObjects(aanwezigen);
      this.editStemming.stemming = stemmingToEdit;
    };
  @action
  toggleEditStemming(stemming) {
    this.editStemming.stemming = stemming;
    this.editMode = true;
  }
  @action
  removeStemming(stemming) {
    stemming.deleteRecord();
    stemming.save();
  }
  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming = null;
  }
}
