import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
export default class AgendaListComponent extends Component {
  constructor(...args){
    super(...args);
  }

  //TODO: make sure the behandeltNa property is properly set
  //TODO 2: make this into a task as it will be slow for many agendapoints. So you can add a spinner the user knows he has to wait
  // Note agendas with more than 50 points are super common!
  //TODO: no async for each please.
  //TODO: i am not sure to undertand the logic (the index == new position so?)
  @action
  async sort(){
    this.args.agendapunten.forEach(async function(agendapunt, index){
      const position = this.args.agendapunten.indexOf(agendapunt);
      this.args.agendapunten.objectAt(index).position = position;
      await this.args.agendapunten.objectAt(index).save();
    }.bind(this));
    this.args.onSort();
  }
}
