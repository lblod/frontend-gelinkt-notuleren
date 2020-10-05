import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AgendaModalComponent extends Component {

  @service store;

  @tracked isEditing = false;

  @tracked currentlyEditing;

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
    await this.createBehandeling(agendapunt);
    this.toggleEditing();
  }
  async createBehandeling(agendapunt) {
    const behandeling = this.store.createRecord('behandeling-van-agendapunt');
    behandeling.openbaar = agendapunt.geplandOpenbaar;
    behandeling.onderwerp = agendapunt;
    await behandeling.save();
  }

}
