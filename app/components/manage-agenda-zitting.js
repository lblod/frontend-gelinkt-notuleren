import { inject as service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency-decorators';

export default class ManageAgendaZittingComponent extends Component {
  @service store;
  @tracked popup = false;
  @tracked agendapoint = [];

  constructor(...args){
    super(...args);
    this.loadAgenda.perform();
  }


  @task
  *loadAgenda() {
    this.agendapoints = new Array();
    const pageSize = 10;
    const firstPage = yield this.store.query('agendapunt', { "filter[zitting][:id:]": this.args.zitting.id , "page[size]": pageSize});
    const count = firstPage.meta.count;
    firstPage.forEach(result => this.agendapoints.push(result));
    let pageNumber = 1;
    while (((pageNumber) * pageSize) < count) {
      const pageResults = yield this.store.query('agendapunt', { "filter[zitting][:id:]": this.args.zitting.id , "page[size]": pageSize, "page[number]": pageNumber});
      pageResults.forEach(result => this.agendapoints.push(result));
      pageNumber++;
    }
    this.agendapoints = this.agendapoints.sortBy('position');
  }

  @action
  cancel(){
    this.popup = false;
    this.loadAgenda.perform();
  }
}
