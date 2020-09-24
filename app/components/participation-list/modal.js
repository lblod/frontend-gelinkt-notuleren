import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ParticipationListModalComponent extends Component {
  tableDataReady = true
  @tracked voorzitter;
  @tracked mandataris;
  @tracked secretaris;
  @tracked presentMandataris;
  @service store;
  
  constructor() {
    super(...arguments)
    this.fetchData()
  }

  async fetchData() {
    let queryParams = {
      'filter[bekleedt][bevat-in][:uri:]': this.args.bestuursorgaan.uri,
    };
    const mandataris = await this.store.query('mandataris', queryParams);
    console.log(mandataris)
    this.mandataris = mandataris
  }

  @action 
  togglePopup() {
    this.args.togglePopup()
  }
  @action
  selectVoorzitter(value){
    console.log(value)
    this.voorzitter = value
  }
  @action
  selectSecretaris(value){
    this.secretaris = value
  }
  @action
  updateMandatarisTable(presentMandataris) {
    console.log('mandataris table')
    console.log(presentMandataris)
    this.presentMandataris = presentMandataris;
  }

  @action
  cancelCreatePerson(){
    
  }
  @action
  finishCreatePerson(){
    
  }
  @action
  insert(){
    const info = {
      voorzitter: this.voorzitter,
      secretaris: this.secretaris,
      presentMandataris: this.presentMandataris
    }
    this.args.onSave(info)
    this.args.togglePopup()
  }
}
