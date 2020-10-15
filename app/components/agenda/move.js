import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaMoveComponent extends Component {

  @tracked selectedLocation;
  @tracked locationOptions = [
    { code: 'start', name: 'Vooraan in agenda' },
    { code: 'after', name: 'Na agendapunt' },
    { code: 'end', name: 'Achteraan in agenda' }
  ];


  @tracked showAfterAgendapuntOptions=false;

  @tracked afterAgendapuntOptions=this.args.agendapunten.filter(function(agendapunt) {
    return agendapunt.id != this.args.agendapunt.id;
  }.bind(this));

  @tracked selectedAfterAgendapunt;

  @action
  selectAfterAgendapunt(option){
    this.selectedAfterAgendapunt=option;
  }

  @action
  selectLocation(option){
    this.selectedLocation=option;
    this.showAfterAgendapuntOptions=false;

    const index=this.args.agendapunten.indexOf(this.args.agendapunt);

    if(option.code=='start'){

    }
    else if(option.code=='end'){

    }
    else if(option.code=='after'){
      this.selectedAfterAgendapunt=
        index==0?
          null:
          this.args.agendapunten.objectAt(index-1);

      this.showAfterAgendapuntOptions=true;
    }
  }
}
