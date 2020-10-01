import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class AgendaListComponent extends Component {
  constructor(...args){
    super(...args);
  }


  @action
  async sort(){
    this.args.agendapunten.forEach(async function(agendapunt, index){
      var position=this.args.agendapunten.indexOf(agendapunt);
      this.args.agendapunten.objectAt(index).position=position;
      await this.args.agendapunten.objectAt(index).save();
    }.bind(this));
  }
}
