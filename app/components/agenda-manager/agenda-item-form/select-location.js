import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaManagerAgendaItemFormSelectLocationComponent extends Component {
  @tracked locationOptions = [
    { code: 'start', name: 'Vooraan in agenda' },
    { code: 'after', name: 'Na agendapunt' },
    { code: 'end', name: 'Achteraan in agenda' }
  ];
  @tracked selectedLocation;
  @tracked selectedAfterItem;



  get showAfterItemOptions() {
    return this.selectedLocation && this.selectedLocation.code === "after";
  }

  get afterItemOptions() {
    return this.args.agendaItems.sortBy("position").reject((x) => x === this.args.currentItem);
  }

  @action
  selectLocation(value) {
    this.selectedLocation = value;
    if(value.code === "start") {
      this.args.model[this.args.for] = 0;
    }
    else if (value.code === "end"){
      this.args.model[this.args.for] = this.args.agendaItems.length - 1;
    }
  }

  @action
  selectAfterItem(value) {
    this.selectedAfterItem = value;
    this.args.model[this.args.for] = value.position + 1;
  }

  searchMatcher(agendapoint, term) {
    return `${agendapoint.position + 1}. ${agendapoint.titel}`.indexOf(term);
  }
}
