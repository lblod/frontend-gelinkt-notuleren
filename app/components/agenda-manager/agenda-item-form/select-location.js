import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaManagerAgendaItemFormSelectLocationComponent extends Component {
  @tracked locationOptions = [
    { code: 'start', name: 'Vooraan in agenda-manager' },
    { code: 'after', name: 'Na agendapunt' },
    { code: 'end', name: 'Achteraan in agenda-manager' }
  ];
  @tracked selectedLocation;
  @tracked selectedAfterItem;



  get showAfterItemOptions() {
    return this.selectedLocation && this.selectedLocation.code === "after";
  }

  get afterItemOptions() {
    return this.args.agendaItems;
  }

  @action selectLocation(value) {
    this.selectedLocation = value;
    if(value.code === "start") {
      this.args.model[this.args.for] = 0;
    }
    else {
      this.args.model[this.args.for] = this.args.agendaItems.length;
    }
  }
  @action selectAfterItem(value) {
    this.selectedAfterItem = value;
    this.args.model[this.args.for] = value.position + 1;
  }


}
