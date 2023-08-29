import { service } from '@ember/service';
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
  @tracked create = false;
  @tracked edit = false;
  @tracked editMode = false;
  /** @type {Stemming} */
  @service store;
  @service editStemming;

  get behandeling() {
    return this.args.behandeling;
  }
  get stemmingen() {
    return this.args.behandeling.sortedVotings ?? [];
  }
  saveStemming = task(async () => {
    const isNew = this.editStemming.stemming.isNew;

    if (isNew) {
      this.editStemming.stemming.position = this.stemmingen.length;
      this.editStemming.stemming.behandelingVanAgendapunt =
        this.args.behandeling;
    }
    await this.editStemming.saveTask.perform();
    this.onCancelEdit();
  });

  addStemming = task(async () => {
    // high pagesize is set on the model, so this is fine
    const participants = await this.args.behandeling.aanwezigen;

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

  @action
  toggleEditStemming(stemming) {
    this.editStemming.stemming = stemming;
    this.editMode = true;
  }

  removeStemming = task(async (stemming) => {
    await stemming.destroyRecord();

    // it may look like we can just use this.stemmingen here, but
    // that's not the case
    // the problem is that when we delete the voting on the first line,
    // the resource starts recalculating. This is an async operation. While the underlying promise
    // is resolving, the resource's value will be null, as normal.
    // It will then later update to the correct value, but a task such as this one won't retrigger
    // (and shouldn't, cause it has side-effects)
    //
    // The core issue is that we are not in a reactive context here. a trackedFunction turns an
    // async context into a reactive one, and here we are in an async context.
    //
    // luckily the trackedFunction provides a way to await its underlying promise
    await this.behandeling.sortedVotingData.retry();
    for (const [i, stemming] of this.stemmingen.entries()) {
      if (i !== stemming.position) {
        stemming.position = i;
        await stemming.save();
      }
    }
  });

  @action
  onCancelEdit() {
    this.editMode = false;
    this.editStemming.stemming.rollbackAttributes();
    this.editStemming.stemming = null;
  }
}
