import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ManageAgendaZittingComponent extends Component {
  constructor(...args){
    super(...args);
  }
  @tracked popup=false;

  @action
  cancel(){
    this.popup=false;
  }
}

