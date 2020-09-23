import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class ParticipationListModalComponent extends Component {
  tableDataReady = true
  @tracked voorzitter;
  @action
  selectVoorzitter(value){
    this.voorzitter = value
  }
  @action
  selectSecretaris(){
    
  }
  @action
  cancelCreatePerson(){
    
  }
  @action
  finishCreatePerson(){
    
  }
}
