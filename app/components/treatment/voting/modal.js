import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { query } from 'ember-data-resources';
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
  @tracked create = false;
  @tracked edit = false;
  @tracked editMode = false;
  /** @type {Stemming} */
  @service store;
  @service editStemming;

  @tracked tableSize = 20;
  @tracked sortBy = 'position';
  @tracked tablePage = 0;

  stemmingen = query(this, 'stemming', () => ({
    sort: this.sortBy,
    'filter[behandeling-van-agendapunt][:id:]': this.args.behandeling.get('id'),
    page: { size: this.tableSize, number: this.tablePage },
  }));

  constructor(parent, args) {
    super(parent, args);
  }

  @task
  /** @type {import("ember-concurrency").Task} */
  *saveStemming() {
    const isNew = this.editStemming.stemming.isNew;

    if (isNew) {
      this.editStemming.stemming.position =
        this.args.behandeling.stemmingen.length;
    }
    yield this.editStemming.saveTask.perform();

    if (isNew) {
      this.args.behandeling.stemmingen.pushObject(this.editStemming.stemming);
      yield this.args.behandeling.save();
    }
    yield this.stemmingen.retry();

    this.onCancelEdit();
  }

  @task
  /** @type {import("ember-concurrency").Task} */
  *addStemming() {
    const richTreatment = yield this.store.query('behandeling-van-agendapunt', {
      'filter[:id:]': this.args.behandeling.id,
      include: 'aanwezigen.bekleedt.bestuursfunctie',
    });
    const participants = richTreatment.firstObject.aanwezigen;

    const stemmingToEdit = this.store.createRecord('stemming', {
      onderwerp: '',
      geheim: false,
      aantalVoorstanders: 0,
      aantalTegenstanders: 0,
      aantalOnthouders: 0,
      gevolg: '',
    });
    this.editMode = true;
    stemmingToEdit.aanwezigen.pushObjects(participants);
    stemmingToEdit.stemmers.pushObjects(participants);
    this.editStemming.stemming = stemmingToEdit;
  }

  @action
  toggleEditStemming(stemming) {
    this.editStemming.stemming = stemming;
    this.editMode = true;
  }

  @task
  *removeStemming(stemming) {
    yield stemming.destroyRecord();
    this.stemmingen = this.stemmingen.reject((x) => x === stemming);
  }

  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming.rollbackAttributes();
    this.editStemming.stemming = null;
  }
}
