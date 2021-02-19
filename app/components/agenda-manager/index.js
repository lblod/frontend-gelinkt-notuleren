import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class AgendaManagerIndexComponent extends Component {
  @service store;
  @tracked popup = false;
  @tracked agendapoints;

  constructor(...args){
    super(...args);
    this.loadAgenda.perform();
  }


  @task
  *loadAgenda() {
    const agendapoints = new Array();
    const pageSize = 10;
    const firstPage = yield this.store.query('agendapunt', { "filter[zitting][:id:]": this.args.zitting.id , "page[size]": pageSize});
    const count = firstPage.meta.count;
    firstPage.forEach(result => agendapoints.push(result));
    let pageNumber = 1;
    while (((pageNumber) * pageSize) < count) {
      const pageResults = yield this.store.query('agendapunt', { "filter[zitting][:id:]": this.args.zitting.id , "page[size]": pageSize, "page[number]": pageNumber});
      pageResults.forEach(result => agendapoints.push(result));
      pageNumber++;
    }
    this.agendapoints = agendapoints.sortBy('position');
  }

  @action
  cancel(){
    this.popup = false;
  }

  @action
  afterSave(agendapoints) {
    this.agendapoints = agendapoints.map((agendapoint) => agendapoint);
    this.args.onChange();
  }
}
