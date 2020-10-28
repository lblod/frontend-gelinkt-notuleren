import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import {restartableTask} from "ember-concurrency-decorators";
import zitting from '../../models/zitting';

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
    this.toBeDeleted.forEach((ap)=>{
      this.zitting.agendapunten.pushObject(ap);
    });
    this.zitting.agendapunten=this.zitting.agendapunten.sortBy('position');
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
    this.zitting.agendapunten=this.zitting.agendapunten.sortBy('position');
    this.showAfterAgendapuntOptions=false;
  }

  @restartableTask
  * saveAll(){
    this.args.cancel();
    yield this.toBeDeleted.forEach(e=>e.destroyRecord());
    yield this.zitting.agendapunten.then(e=>e.save());
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
        agendapunt.vorigeAgendapunt = this.zitting.agendapunten.objectAt(i- 1);
        agendapunt.behandeling.vorigeBehandelingVanAgendapunt = this.zitting.agendapunten.objectAt(i - 1).behandeling;
      }
      else{
        agendapunt.vorigeAgendapunt=null;
        agendapunt.behandeling.vorigeBehandelingVanAgendapunt=null;
      }
    });
  }

  @action
  async sort() {
    this.zitting.agendapunten.forEach((agendapunt, index)=>{
      agendapunt.position = index;
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
      this.zitting.agendapunten.objectAt(apIndex).position=apAfterIndex

      this.zitting.agendapunten.forEach((e, i)=>{

        if(i<=apAfterIndex && i>apIndex){
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
