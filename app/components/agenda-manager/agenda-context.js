import Component from '@glimmer/component';
import {task} from "ember-concurrency-decorators";
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';

export default class AgendaManagerAgendaContextComponent extends Component {
  @service store;
  items = tracked([]);

  constructor(...args) {
    super(...args);
    this.loadItemsTask.perform();
  }


  @task
  * loadItemsTask() {
    const agendaItems = [];
    const pageSize = 10;

    const firstPage = yield this.store.query('agendapunt', {
      "filter[zitting][:id:]": this.args.zittingId,
      "page[size]": pageSize
    });
    const count = firstPage.meta.count;
    firstPage.forEach(result => agendaItems.push(result));
    let pageNumber = 1;

    while (((pageNumber) * pageSize) < count) {
      const pageResults = yield this.store.query('agendapunt', {
        "filter[zitting][:id:]": this.args.zittingId,
        "page[size]": pageSize,
        "page[number]": pageNumber
      });
      pageResults.forEach(result => agendaItems.push(result));
      pageNumber++;
    }
    this.items = agendaItems.sortBy('position');
  }

  @task
  * saveItemsTask() {

  }

  @task
  * loadStatusesTask() {
    this.conceptStatus = yield this.store.findRecord('concept', 'a1974d071e6a47b69b85313ebdcef9f7');
    this.geagendeerdStatus = yield this.store.findRecord('concept', '7186547b61414095aa2a4affefdcca67');
  }

  @action
  /**
   * Create a new agenda item
   * @return {Agendapunt} the newly created item
   */
  createItem() {
    const item = this.store.createRecord("agendapunt");
    item.titel = "";
    item.beschrijving = "";
    item.geplandOpenbaar = true;
    item.position = this.items.length;
    this.items.push(item);
    return item;
  }

  @action
  createBehandeling(agendapunt) {

    if(!agendapunt.behandeling.content){
      const behandeling = this.store.createRecord("behandeling-van-agendapunt");
      behandeling.openbaar = agendapunt.geplandOpenbaar;
      behandeling.onderwerp = agendapunt;
    }
  }

  @action
  /**
   * Delete an agenda item
   * @param {Agendapunt} item the item to be deleted
   */
  deleteItem(item) {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
  }

  @action onSort() {
    this.items.forEach((item, index) => {
      item.position = index;
    });
  }
}
