import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { tracked } from 'tracked-built-ins';
import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
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
  @tracked stemmingen = tracked([]);
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

  fetchStemmingen = task({ restartable: true }, async () => {
    const stemmingen = [];
    const pageSize = 20;

    const firstPage = await this.store.query('stemming', {
      'filter[behandeling-van-agendapunt][:id:]': this.args.behandeling.id,
      sort: 'position',
      page: {
        size: pageSize,
      },
    });
    const count = firstPage.meta.count;
    firstPage.forEach((result) => stemmingen.push(result));
    let pageNumber = 1;

    while (pageNumber * pageSize < count) {
      const pageResults = await this.store.query('stemming', {
        'filter[behandeling-van-agendapunt][:id:]': this.args.behandeling.id,
        sort: 'position',
        page: {
          size: pageSize,
          number: pageNumber,
        },
      });
      pageResults.forEach((result) => stemmingen.push(result));
      pageNumber++;
    }
    this.stemmingen = tracked(stemmingen);
  });

  saveStemming = task(async () => {
    const isNew = this.editStemming.stemming.isNew;

    if (isNew) {
      this.editStemming.stemming.position = this.stemmingen.length;
      this.editStemming.stemming.behandelingVanAgendapunt =
        this.args.behandeling;
      this.stemmingen.push(this.editStemming.stemming);
    }
    await this.editStemming.saveTask.perform();
    this.onCancelEdit();
  });

  addStemming = task(async () => {
    const richTreatment = await this.store.query('behandeling-van-agendapunt', {
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
  });

  fixPositions = task(async () => {
    for (const [i, stemming] of this.stemmingen.entries()) {
      if (i !== stemming.position) {
        stemming.position = i;
        await stemming.save();
      }
    }
  });

  @action
  toggleEditStemming(stemming) {
    this.editStemming.stemming = stemming;
    this.editMode = true;
  }

  removeStemming = task(async (stemming) => {
    await stemming.destroyRecord();
    const index = this.stemmingen.indexOf(stemming);
    this.stemmingen.splice(index, 1);
    await this.fixPositions.perform();
  });

  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming.rollbackAttributes();
    this.editStemming.stemming = null;
  }
}
