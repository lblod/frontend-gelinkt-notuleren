import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import Component from "@glimmer/component";
import { task, restartableTask } from "ember-concurrency-decorators";
import ManageAgendaZittingComponent from "../../manage-agenda-zitting";
import { allSettled } from "ember-concurrency";
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

const COUNCIL_MEMBER_URI = "http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011";

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
      const richTreatment = yield this.store.query("behandeling-van-agendapunt", {
        "filter[:id:]": this.args.behandeling.id,
        include: "aanwezigen.bekleedt.bestuursfunctie"
      });
      const participants = richTreatment.firstObject.aanwezigen.filter(
        (mandatee) =>
          mandatee.bekleedt.get("bestuursfunctie").get("uri") === COUNCIL_MEMBER_URI
      );

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
  @action
  removeStemming(stemming) {
    stemming.deleteRecord();
    stemming.save();
  }
  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming.rollbackAttributes();
    this.editStemming.stemming = null;
  }
}
