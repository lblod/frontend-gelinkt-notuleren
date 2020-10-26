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

  @tracked isNew = false;

  @tracked agendapunten = this.args.agendapunten;

  @action
  async cancel(){
    this.args.agendapunten.forEach((agendapunt)=>{
      agendapunt.rollbackAttributes();
    });
    this.args.cancel();
  }

  @action
  async createAgendapunt() {
    const agendapunt = this.store.createRecord('agendapunt');
    agendapunt.titel = "";
    agendapunt.beschrijving = "";
    agendapunt.geplandOpenbaar = false;
    agendapunt.position = this.agendapunten.length;
    this.agendapunten.pushObject(agendapunt);
    this.edit(agendapunt);
    this.isNew = true;
  }

  @action
  async edit(agendapunt) {

    this.afterAgendapuntOptions=this.agendapunten.filter((ap)=>{
      return ap != agendapunt;
    });

    this.selectedLocation=null;
    this.selectedAfterAgendapunt=null;

    this.currentlyEditing = agendapunt;
    this.toggleEditing();
  }

  @action
  async delete(){
    this.agendapunten.removeObject(this.currentlyEditing);
    this.cancelEditing();
  }

  @action
  async toggleEditing() {
    this.isEditing = !this.isEditing;
  }

  @action
  async cancelEditing(){
    this.toggleEditing();
    if(this.isNew){
      this.agendapunten.removeObject(this.currentlyEditing);
      this.isNew=false;
    }
    else{
      this.currentlyEditing.rollbackAttributes();
    }
    this.showAfterAgendapuntOptions=false;
  }

  @action
  async saveAll(){
    await this.agendapunten.then(arr => arr.save());
    this.args.afterSave();
  }

  @action
  async save() {
    if (this.isNew) {
      this.createBehandeling(this.currentlyEditing);
      this.isNew = false;
    }
    this.showAfterAgendapuntOptions=false;
    this.toggleEditing();
    this.updateVorigeAgendaPunten();
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
    agendapunt.behandeling = behandeling;
  }

  //this assumes everything is sorted
  @action
  async updateVorigeAgendaPunten(){
    this.agendapunten.forEach((agendapunt, i)=>{
      if(i>0){
        agendapunt.vorigeAgendapunt=this.agendapunten[i-1];
      }
    });
  }

  @action
  async sort() {
    this.agendapunten.forEach((agendapunt, index, agendapunten)=>{
      agendapunt.position = index;
      if (index > 0) {
        agendapunt.vorigeAgendapunt = agendapunten.objectAt(index - 1);
        agendapunt.behandeling.vorigeBehandelingVanAgendapunt = agendapunten.objectAt(index - 1).behandeling;
      }
    });
    this.updateVorigeAgendaPunten();
  }

  //edit screen sorting

  @tracked showAfterAgendapuntOptions=false;

  @tracked selectedAfterAgendapunt;

  @tracked selectedLocation;

  @tracked afterAgendapuntOptions;

  @action
  selectAfterAgendapunt(option){
    this.selectedAfterAgendapunt=option;
    const apIndex=this.agendapunten.indexOf(this.currentlyEditing);
    const apAfterIndex=this.agendapunten.indexOf(option);

    if(apIndex>apAfterIndex){

      this.agendapunten.objectAt(apIndex).position=apAfterIndex+1;

      this.agendapunten.forEach((e, i)=>{
        if(i>apAfterIndex && i<apIndex){
          this.agendapunten.objectAt(i).position+=1;
        }
      });
    }

    else if(apIndex<apAfterIndex){

      this.agendapunten.objectAt(apIndex).position=apAfterIndex+1;

      this.agendapunten.forEach((e, i)=>{
        if(i<apAfterIndex && i>apIndex){
          this.agendapunten.objectAt(i).position-=1;
        }
      });
    }

    this.agendapunten=this.agendapunten.sortBy('position');
  }

  @action
  async selectLocation(option){
    this.selectedLocation=option;
    this.showAfterAgendapuntOptions=false;

    const index=this.agendapunten.indexOf(this.currentlyEditing);

    if(option.code=='start'){

      this.currentlyEditing.position=0;

      this.agendapunten.forEach((e, i)=>{
        if(i<index){
          this.agendapunten.objectAt(i).position+=1;
        }
      });
    }

    else if(option.code=='end'){
      this.currentlyEditing.position=this.agendapunten.length-1;

      this.agendapunten.forEach((e, i)=>{
        if(i>index){
          this.agendapunten.objectAt(i).position-=1;
        }
      });
    }

    else if(option.code=='after'){
      this.showAfterAgendapuntOptions=true;
    }

    this.agendapunten=this.agendapunten.sortBy('position');
  }


}
