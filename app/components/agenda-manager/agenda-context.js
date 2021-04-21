import Component from '@glimmer/component';
import {task} from "ember-concurrency-decorators";
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';
import {DRAFT_STATUS_ID, PUBLISHED_STATUS_ID, SCHEDULED_STATUS_ID} from "../../utils/constants";


export default class AgendaManagerAgendaContextComponent extends Component {
  @service store;
  @tracked _newItem;
  @tracked items = tracked([]);

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
    const treatment = yield item.behandeling;
    yield treatment.saveAndPersistDocument();

    if (item.isNew) {
      item.zitting = zitting;
      this.items.push(item);
    }
    this.repositionItem(item);
    yield this.savePositionsTask.perform();

    const container = yield treatment.get("documentContainer");
    const status = yield container.get("status");
    if (!status || status.get("id") !== PUBLISHED_STATUS_ID) {
      // it's not published, so we set the status
      container.status = yield this.store.findRecord('concept', SCHEDULED_STATUS_ID);
    }
    yield container.save();

    yield item.save();
    yield this.args.onSave();
    // yield this.saveItemsTask.perform();
  }

  repositionItem(item) {
    if (item.changedAttributes()["position"]) {
      const [oldPos, newPos] = item.changedAttributes()["position"];
      const position = newPos ?? this.items.length;
      this.items.splice(oldPos, 1);
      this.items.splice(position, 0, item);
    }
  }


  /**
   * Create a new agenda item
   * @return {Agendapunt} the newly created item
   */
  @task
  * createItemTask() {
    const item = this.store.createRecord("agendapunt", {
      titel: "",
      beschrijving: "",
      geplandOpenbaar: true,
    });
    item.behandeling = yield this.createBehandelingTask.perform(item);
    return item;
  }

  @task
  * createBehandelingTask(agendapunt) {
    const behandeling = this.store.createRecord("behandeling-van-agendapunt",
      {
        openbaar: agendapunt.geplandOpenbaar,
        onderwerp: agendapunt,
      });
    yield behandeling.initializeDocument();
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
    const behandeling = yield item.behandeling;
    if (behandeling) {
      const container = yield behandeling.documentContainer;
      if (container) {
        container.status = yield this.store.findRecord('concept', DRAFT_STATUS_ID);
        yield container.save();
      }

      yield behandeling.destroyRecord();
    }
    yield item.destroyRecord();
    yield this.args.onSave();
  }

  @task
  * onSortTask() {
    yield this.savePositionsTask.perform();
    yield this.args.onSave();
  }

  @task
  * savePositionsTask() {
    let previous = null;
    for (const [index, item] of this.items.entries()) {
      item.position = index;
      item.vorigeAgendapunt = previous;
      previous = item;
      yield item.save();
    }

  }
}
