import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class AgendaManagerAgendaItemFormTextAreaComponent extends Component {
  get value() {
    return this.args.model[this.args.for];
  }

  /**
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  @action
  handleValueChange(event) {
    this.args.model[this.args.for] = event.target.value;
  }

  set value(newVal) {
    this.args.model[this.args.for] = newVal;
  }
}
