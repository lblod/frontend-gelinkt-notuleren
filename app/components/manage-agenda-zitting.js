import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class ManageAgendaZittingComponent extends Component {
  constructor(...args){
    super(...args);

    this.args.zitting.agendapunten=this.args.zitting.agendapunten.sortBy('position');
  }
  @tracked popup=false;

  @action
  cancel(){
    this.popup=false;
  }
}

