import Component from '@glimmer/component';
import {action} from '@ember/object';

export default class AgendaManagerAgendaItemFormRadioIndexComponent extends Component {
  get selectedOption() {
    return this.args.model[this.args.for];
  }
  @action
  selectOption(value){
    this.args.model[this.args.for] = value;
  }

}
