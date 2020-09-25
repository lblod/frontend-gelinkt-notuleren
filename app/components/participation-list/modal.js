import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ParticipationListModalComponent extends Component {
  tableDataReady = true
  @tracked voorzitter;
  @tracked mandataris;
  @tracked secretaris;
  @tracked aanwezigenBijStart;
  @service store;
  
  constructor() {
    super(...arguments);
    this.voorzitter = this.args.voorzitter;
    this.secretaris = this.args.secretaris;
    this.fetchData();
  }

  async fetchData() {
    let queryParams = {
      'filter[bekleedt][bevat-in][:uri:]': this.args.bestuursorgaan.get('uri'),
    };
    const mandataris = await this.store.query('mandataris', queryParams);
    this.mandataris = mandataris;
  }

  @action 
  togglePopup() {
    this.args.togglePopup();
  }
  @action
  selectVoorzitter(value){
    this.voorzitter = value;
  }
  @action
  selectSecretaris(value){
    this.secretaris = value;
  }
  @action
  updateMandatarisTable(aanwezigenBijStart) {
    this.aanwezigenBijStart = aanwezigenBijStart;
  }
  @action
  insert(){
    const info = {
      voorzitter: this.voorzitter,
      secretaris: this.secretaris,
      aanwezigenBijStart: this.aanwezigenBijStart
    };
    this.args.onSave(info);
    this.args.togglePopup();
  }
}
