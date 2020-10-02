import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import {task} from 'ember-concurrency-decorators';

export default class ParticipationListModalComponent extends Component {
  @tracked voorzitter;
  @tracked mandataris;
  @tracked secretaris;
  @tracked aanwezigenBijStart;
  @service store;
  
  constructor() {
    super(...arguments);
    this.voorzitter = this.args.voorzitter;
    this.secretaris = this.args.secretaris;
  }

  @task
  *fetchData() {
    let queryParams = {
      'filter[bekleedt][bevat-in][:uri:]': this.args.bestuursorgaan.get('uri'),
       page: { size: 100 } //arbitrary number, later we will make sure there is previous last. (also like this in the plugin)
    };
    const mandataris = yield this.store.query('mandataris', queryParams);
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
