import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaModalComponent extends Component {
  @tracked isEditing=false;
  @tracked currentlyEditing;
  @action
  async edit(agendapunt){
    this.currentlyEditing=agendapunt;
    this.isEditing=true;
  }

}
