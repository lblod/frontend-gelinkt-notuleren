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

  @tracked afterAgendapuntOptions=this.args.agendapunten.filter((agendapunt)=>{
    return agendapunt.id != this.args.agendapunt.id;
  });

  @tracked selectedAfterAgendapunt;

  @action
  selectAfterAgendapunt(option){
    this.selectedAfterAgendapunt=option;
    const apIndex=this.args.agendapunten.indexOf(this.args.agendapunt);
    const apAfterIndex=this.args.agendapunten.indexOf(option);

    if(apIndex>apAfterIndex){

      this.args.agendapunten.objectAt(apIndex).position=apAfterIndex+1;

      this.args.agendapunten.forEach((e, i)=>{
        if(i>apAfterIndex && i<apIndex){
          this.args.agendapunten.objectAt(i).position+=1;
        }
      });
    }

    else if(apIndex<apAfterIndex){

      this.args.agendapunten.objectAt(apIndex).position=apAfterIndex+1;

      this.args.agendapunten.forEach((e, i)=>{
        if(i<apAfterIndex && i>apIndex){
          this.args.agendapunten.objectAt(i).position-=1;
        }
      });
    }

    this.args.zitting.agendapunten=this.args.zitting.agendapunten.sortBy('position');
  }

  @action
  async selectLocation(option){
    this.selectedLocation=option;
    this.showAfterAgendapuntOptions=false;

    const index=this.args.agendapunten.indexOf(this.args.agendapunt);

    if(option.code=='start'){

      this.args.agendapunt.position=0;

      this.args.agendapunten.forEach((e, i)=>{
        if(i<index){
          this.args.agendapunten.objectAt(i).position+=1;
        }
      });
    }

    else if(option.code=='end'){

      this.args.agendapunt.position=this.args.agendapunten.length-1;

      this.args.agendapunten.forEach((e, i)=>{
        if(i>index){
          this.args.agendapunten.objectAt(i).position-=1;
        }
      });
    }

    else if(option.code=='after'){
      this.showAfterAgendapuntOptions=true;
    }

    this.args.zitting.agendapunten=this.args.zitting.agendapunten.sortBy('position');
  }
}
