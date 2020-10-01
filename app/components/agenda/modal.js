import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class AgendaModalComponent extends Component {

  @service store;

  @tracked isEditing=false;

  @tracked currentlyEditing;

  @action
  async edit(agendapunt){
    this.currentlyEditing=agendapunt;
    this.toggleEditing();
  }
  @action
  async createAgendapunt(){
    const agendapunt=this.store.createRecord('agendapunt');
    agendapunt.titel="";
    agendapunt.beschrijving="";
    agendapunt.geplandOpenbaar=false;
    agendapunt.position=0;
    await agendapunt.save();

    await this.args.zitting.agendapunten;
    this.args.zitting.agendapunten.pushObject(agendapunt);
    await this.args.zitting.save();
    this.edit(agendapunt);
  }
  @action
  async toggleEditing(){
    this.isEditing=!this.isEditing;
  }
  @action
  async save(){
    await this.currentlyEditing;
    await this.currentlyEditing.save();
    this.toggleEditing();
  }
}
