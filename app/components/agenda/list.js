import Component from '@glimmer/component';
import {task} from "ember-concurrency-decorators";

export default class AgendaListComponent extends Component {
  constructor(...args) {
    super(...args);
  }

  // Note agendas with more than 50 points are super common!
  @task
  * sort() {
    this.args.agendapunten.forEach(function (agendapunt, index, agendapunten) {
      agendapunt.position = index;
      if (index > 0) {
        agendapunt.vorigeAgendapunt = agendapunten.objectAt(index - 1);
        agendapunt.behandeling.vorigeBehandelingVanAgendapunt = agendapunten.objectAt(index - 1).behandeling;
      }
    });
    // bit of a strange construction, but this gets us out of the
    // PromiseManyArray into a ManyArray, which has a save method.
    // keep in mind that this still sends N requests, but in parallel
    yield this.args.agendapunten.then(arr => arr.save());
    this.args.onSort();
  }
}
