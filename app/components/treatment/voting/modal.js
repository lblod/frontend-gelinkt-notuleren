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
  @tracked stemmingToEdit;
  @service store;

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
  saveStemming = function* (stemming) {
    yield stemming.save();
    this.args.behandeling.stemmingen.pushObject(stemming);
    yield this.args.behandeling.save();
    yield this.fetchStemmingen.perform();
  };

  @task
  /** @type {import("ember-concurrency").Task} */
  addStemming =
    /** @this {TreatmentVotingModalComponent} */
    function* () {
      const aanwezigen = yield this.args.behandeling.aanwezigen;

      this.stemmingToEdit = this.store.createRecord("stemming", {
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
      this.stemmingToEdit.aanwezigen.pushObjects(aanwezigen);
    };
  @action
  editStemming(stemming) {
    this.stemmingToEdit = stemming;
    this.editMode = true;
  }
  @action
  removeStemming(stemming) {}
  @action
  onCancelEdit() {
    this.editMode = false;
    this.stemmingToEdit = null;
  }
}
