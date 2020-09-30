import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ManageAgendaZittingComponent extends Component {
  constructor(...args){
    super(...args);
  }

  @service store

  @tracked popup=false;

  @action
  cancel(){
    this.popup=false;
  }

  @action
  async createAgendapunt(){
    const agendapunt=this.store.createRecord('agendapunt');
    agendapunt.titel="";
    agendapunt.beschrijving="";
    agendapunt.geplandOpenbaar=false;
    await agendapunt.save();

    await this.args.zitting.agendapunten;
    this.args.zitting.agendapunten.pushObject(agendapunt);
    await this.args.zitting.save();
  }

  @action
  async deleteAgendapunt(agendapunt){
    await agendapunt.destroyRecord();
  }

  @action
  async saveAgendapunten(){
    this.args.zitting.agendapunten.forEach(async function(element){
      await element.save();
    });
    await this.args.zitting.save();
  }

  //for debugging purposes
  async deleteAlleAgendaPunten(){
    var agendapunten=await this.args.zitting.agendapunten;
    agendapunten.forEach(element => {
      element.destroyRecord();
    });
  }

}

