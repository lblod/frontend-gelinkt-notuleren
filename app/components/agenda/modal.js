import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AgendaModalComponent extends Component {

  @service store;

  @tracked isEditing = false;

  @tracked currentlyEditing;

  isNew = false;

  get afterSave() {
    return this.args.afterSave || (() => { });
  }

  @action
  async edit(agendapunt) {
    this.currentlyEditing = agendapunt;
    this.toggleEditing();
  }
  @action
  async createAgendapunt() {
    const agendapunt = this.store.createRecord('agendapunt');
    agendapunt.titel = "";
    agendapunt.beschrijving = "";
    agendapunt.geplandOpenbaar = false;
    agendapunt.position = 0;
    this.isNew = true;
    this.edit(agendapunt);
  }
  @action
  async toggleEditing() {
    this.isEditing = !this.isEditing;
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
    this.afterSave();
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
    behandeling.voorzitter = this.args.zitting.voorzitter;
    behandeling.secretaris = this.args.zitting.secretaris;
    await behandeling.save();
    // agendapunt.behandeling = behandeling;
    // await agendapunt.save();
  }

}
