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

  @tracked zitting=this.args.zitting;

  toBeDeleted=[];

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
    agendapunt.position = this.zitting.agendapunten.length;
    this.zitting.agendapunten.pushObject(agendapunt);
    this.edit(agendapunt);
    this.isNew = true;
  }

  @action
  async edit(agendapunt) {

    this.afterAgendapuntOptions=this.zitting.agendapunten.filter((ap)=>{
      return ap != agendapunt;
    });

    this.selectedLocation=null;
    this.selectedAfterAgendapunt=null;

    this.currentlyEditing = agendapunt;
    this.toggleEditing();
  }

  @action
  async delete(){
    this.zitting.agendapunten.removeObject(this.currentlyEditing);
    this.toBeDeleted.push(this.currentlyEditing);
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
      this.zitting.agendapunten.removeObject(this.currentlyEditing);
      this.toBeDeleted.push(this.currentlyEditing);
      this.isNew=false;
    }
    else{
      this.currentlyEditing.rollbackAttributes();
    }
    this.showAfterAgendapuntOptions=false;
  }

  @action
  async saveAll(){
    this.args.cancel();
    await this.toBeDeleted.forEach(e => e.destroyRecord());
    await this.zitting.agendapunten.forEach(async function(e){
      e.save();
    });
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
    behandeling.aanwezigen = this.zitting.aanwezigenBijStart;
    agendapunt.behandeling = behandeling;
  }

  //this assumes everything is sorted
  @action
  async updateVorigeAgendaPunten(){
    this.zitting.agendapunten.forEach((agendapunt, i)=>{
      if(i>0){
        agendapunt.vorigeAgendapunt=this.zitting.agendapunten[i-1];
      }
    });
  }

  @action
  async sort() {
    this.zitting.agendapunten.forEach((agendapunt, index, agendapunten)=>{
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
    const apIndex=this.zitting.agendapunten.indexOf(this.currentlyEditing);
    const apAfterIndex=this.zitting.agendapunten.indexOf(option);

    if(apIndex>apAfterIndex){

      this.zitting.agendapunten.objectAt(apIndex).position=apAfterIndex+1;

      this.zitting.agendapunten.forEach((e, i)=>{
        if(i>apAfterIndex && i<apIndex){
          this.zitting.agendapunten.objectAt(i).position+=1;
        }
      });
    }

    else if(apIndex<apAfterIndex){

      this.zitting.agendapunten.objectAt(apIndex).position=apAfterIndex+1;

      this.zitting.agendapunten.forEach((e, i)=>{
        if(i<apAfterIndex && i>apIndex){
          this.zitting.agendapunten.objectAt(i).position-=1;
        }
      });
    }

    this.zitting.agendapunten=this.zitting.agendapunten.sortBy('position');
    this.updateVorigeAgendaPunten();
  }

  @action
  async selectLocation(option){
    this.selectedLocation=option;
    this.showAfterAgendapuntOptions=false;

    const index=this.zitting.agendapunten.indexOf(this.currentlyEditing);

    if(option.code=='start'){

      this.currentlyEditing.position=0;

      this.zitting.agendapunten.forEach((e, i)=>{
        if(i<index){
          this.zitting.agendapunten.objectAt(i).position+=1;
        }
      });
    }

    else if(option.code=='end'){

      this.currentlyEditing.position=this.zitting.agendapunten.length-1;

      this.zitting.agendapunten.forEach((e, i)=>{
        if(i>index){
          this.zitting.agendapunten.objectAt(i).position-=1;
        }
      });
    }

    else if(option.code=='after'){
      this.showAfterAgendapuntOptions=true;
    }

    this.zitting.agendapunten=this.zitting.agendapunten.sortBy('position');
    this.updateVorigeAgendaPunten();
  }


}
