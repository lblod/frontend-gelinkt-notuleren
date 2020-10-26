import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import {restartableTask} from "ember-concurrency-decorators";

export default class AgendaModalComponent extends Component {

  @service store;

  @tracked isEditing = false;

  @tracked currentlyEditing;

  @tracked beforeEditingState;

  @tracked isNew = false;

  @action
  async createAgendapunt() {
    const agendapunt = this.store.createRecord('agendapunt');
    agendapunt.titel = "";
    agendapunt.beschrijving = "";
    agendapunt.geplandOpenbaar = false;
    agendapunt.position = this.args.zitting.agendapunten.length;
    this.args.zitting.agendapunten.pushObject(agendapunt);
    this.isNew = true;
    this.edit(agendapunt);
  }

  @action
  async edit(agendapunt) {
    this.currentlyEditing = agendapunt;
    this.toggleEditing();
  }

  @action
  async toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  @action cancelEditing(){
    this.toggleEditing();
    if(this.isNew){
      this.currentlyEditing.deleteRecord();
    }
    this.isNew=false;
  }

  @action
  async saveAll(){
    await this.args.zitting.agendapunten.then(arr => arr.save());
    this.args.afterSave();
  }

  @action
  async save() {
    const agendapunt = this.currentlyEditing;
    await agendapunt.save();
    this.args.zitting.agendapunten.pushObject(agendapunt);
    await this.args.zitting.save();
    if (this.isNew) {
      await this.createBehandeling(agendapunt);
      this.isNew = false;
    }
    this.toggleEditing();
    // this.afterSave();
  }
  /**
   * @param {import("../../models/agendapunt").default} agendapunt
   */
  async createBehandeling(agendapunt) {
    /** @type {import("../../models/behandeling-van-agendapunt").default)} */
    const behandeling = this.store.createRecord('behandeling-van-agendapunt');
    behandeling.openbaar = agendapunt.geplandOpenbaar;
    behandeling.onderwerp = agendapunt;
    behandeling.aanwezigen = this.args.zitting.aanwezigenBijStart;
    // await behandeling.save();
    // // agendapunt.behandeling = behandeling;
    // // await agendapunt.save();
  }


  // Note agendas with more than 50 points are super common!
  @action
  async sort() {
    this.args.agendapunten.forEach(function (agendapunt, index, agendapunten) {
      agendapunt.position = index;
      if (index > 0) {
        agendapunt.vorigeAgendapunt = agendapunten.objectAt(index - 1);
        agendapunt.behandeling.vorigeBehandelingVanAgendapunt = agendapunten.objectAt(index - 1).behandeling;
      }
    });
    // bit of a strange construction, but this gets us out of the
    // PromiseManyArray into a ManyArray, which has a save method.
    // keep in mind that this still sends N requests, but in parallel
    // yield this.args.agendapunten.then(arr => arr.save());
    // this.afterSave();
  }

}
