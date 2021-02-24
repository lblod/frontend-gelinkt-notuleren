import Component from '@glimmer/component';

export default class AgendaManagerAgendaItemFormTextAreaComponent extends Component {
  get value() {
    return this.args.model[this.args.for];
  }

  set value(newVal) {
    this.args.model[this.args.for] = newVal;
  }
}
