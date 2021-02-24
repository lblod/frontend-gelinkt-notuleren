import Component from '@glimmer/component';
import {task, TrackedArray} from "ember-concurrency-decorators";
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';
import {action} from '@ember/object';

export default class AgendaManagerAgendaContextComponent extends Component {
  @service store;
  @tracked _newItem;
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
    this.items = tracked(agendaItems.sortBy('position'));
  }

  @task
  * saveItemTask(item) {
    const zitting = yield this.store.findRecord("zitting", this.args.zittingId);
    if (item.isNew) {
      item.zitting = zitting;
    }
    const treatment = yield item.behandeling;
    if (!treatment) {
      const newTreatment = this.createBehandeling(item);
      yield newTreatment.save();
      item.behandeling = newTreatment;
    }
    yield item.save();
    yield this.saveItemsTask.perform();
  }

  @task
  * saveItemsTask() {
    const zitting = yield this.store.findRecord("zitting", this.args.zittingId);
    zitting.agendapunten = this.items;
    yield zitting.save();
    yield this.args.onSave();
  }

  @task
  * loadStatusesTask() {
    this.conceptStatus = yield this.store.findRecord('concept', 'a1974d071e6a47b69b85313ebdcef9f7');
    this.geagendeerdStatus = yield this.store.findRecord('concept', '7186547b61414095aa2a4affefdcca67');
  }

  /**
   * Create a new agenda item
   * @return {Agendapunt} the newly created item
   */
  @action
  createItem() {
    const item = this.store.createRecord("agendapunt");
    item.titel = "";
    item.beschrijving = "";
    item.geplandOpenbaar = true;
    item.position = this.items.length;
    const treatment = this.createBehandeling(item);
    item.behandeling = treatment;
    this.items.push(item);
    return item;
  }


  createBehandeling(agendapunt) {
    const behandeling = this.store.createRecord("behandeling-van-agendapunt");
    behandeling.openbaar = agendapunt.geplandOpenbaar;
    behandeling.onderwerp = agendapunt;
    return behandeling;
  }

  /**
   * Delete an agenda item
   * @param {Agendapunt} item the item to be deleted
   */
  @task
  * deleteItemTask(item) {
    const index = this.items.indexOf(item);
    this.items.splice(index, 1);
    item.deleteRecord();
    yield item.save();
    yield this.saveItemsTask.perform();
  }

  @action onSort() {
    this.items.forEach((item, index) => {
      item.position = index;
    });
  }
}
