import Component from '@glimmer/component';
import {task, all} from "ember-concurrency";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';
import {DRAFT_STATUS_ID, PUBLISHED_STATUS_ID, SCHEDULED_STATUS_ID} from "../../utils/constants";

export default class AgendaManagerAgendaContextComponent extends Component {
  @service store;
  @tracked _newItem;
  @tracked items = tracked([]);
  changeSet = new Set();

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
      "page[size]": pageSize,
      include: "vorige-agendapunt,behandeling.vorige-behandeling-van-agendapunt"
    });
    const count = firstPage.meta.count;
    firstPage.forEach(result => agendaItems.push(result));
    let pageNumber = 1;

    while (((pageNumber) * pageSize) < count) {
      const pageResults = yield this.store.query('agendapunt', {
        "filter[zitting][:id:]": this.args.zittingId,
        "page[size]": pageSize,
        "page[number]": pageNumber,
      include: "vorige-agendapunt,behandeling.vorige-behandeling-van-agendapunt"
      });
      pageResults.forEach(result => agendaItems.push(result));
      pageNumber++;
    }
    this.items = tracked(agendaItems.sortBy('position'));
  }


  /**
   * Create a new agenda item
   * @return {Agendapunt} the newly created item
   */
  @action
  createAgendaItem() {
    const agendaItem = this.store.createRecord("agendapunt", {
      titel: "",
      beschrijving: "",
      geplandOpenbaar: true,
      position: this.items.length
    });

    agendaItem.behandeling = this.store.createRecord("behandeling-van-agendapunt", {
      openbaar: agendaItem.geplandOpenbaar,
      onderwerp: agendaItem,
      });

    this.args.onCreate(agendaItem);
    return agendaItem;
  }

  /**
   * Update and persist an item. Makes sure the local tracking array,
   * links and position properties of all items are in sync.
   *
   * @param {Agendapunt} item
   */
  @task
  * updateItemTask(item) {
    const treatment = yield item.behandeling;
    yield treatment.saveAndPersistDocument();

    if (item.isNew) {
      const zitting = yield this.store.findRecord("zitting", this.args.zittingId);
      this.setProperty(item, "zitting", zitting);
    }

    yield this.updatePositionTask.perform(item);

    const container = yield treatment.get("documentContainer");
    const status = yield container.get("status");
    if (!status || status.get("id") !== PUBLISHED_STATUS_ID) {
      // it's not published, so we set the status
      const conceptStatus = yield this.store.findRecord('concept', SCHEDULED_STATUS_ID);
      this.setProperty(container, "status", conceptStatus);
    }

    yield this.saveItemsTask.perform();
  }

  /**
   * Delete an agenda item
   * @param {Agendapunt} item the item to be deleted
   */
  @task
  * deleteItemTask(item) {
    const index = item.position;

    this.items.splice(index, 1);

    const treatment = yield item.behandeling;
    if (treatment) {
      const container = yield treatment.documentContainer;
      if (container) {
        const draftStatus = yield this.store.findRecord('concept', DRAFT_STATUS_ID);
        this.setProperty(container, "status", draftStatus);
      }
      yield treatment.destroyRecord();
    }
    yield item.destroyRecord();
    yield this.repairPositionsTask.perform();
    yield this.saveItemsTask.perform();
  }


  /**
   * Handles a rearrangement of the this.items array
   * Takes the array index as source of truth.
   */
  @task
  * onSortTask() {
    yield this.repairPositionsTask.perform();
    yield this.saveItemsTask.perform();
  }

  @task
  * resetItemTask(agendaItem) {
    let behandeling = yield agendaItem.behandeling;
    behandeling.rollbackAttributes();
    agendaItem.rollbackAttributes();

    this.args.onCancel();
  }


  /**
   * Take item.position as source of truth and update the linked list and the this.items
   * array to reflect the new position
   *
   * @param {Agendapunt} item
   * @private
   */
  @task
  * updatePositionTask(item) {
    const position = item.position;

    if(this.items[position] !== item) {
      const oldIndex = this.items.indexOf(item);
      if(oldIndex > -1) {
        this.items.splice(oldIndex, 1);
      }
      this.items.splice(position, 0, item);
      yield this.repairPositionsTask.perform();
    }
  }


  /**
   * Take the this.items array index as source of truth and
   * update the item position and links
   * Only updates when necessary, does not persist the changes
   *
   * @param {number} [from]
   * @param {number} [to]
   * @private
   * */
  @task
  * repairPositionsTask(){
    let previous = null;
    for (const [index, item] of this.items.entries()) {
      const previousItem = yield item.vorigeAgendapunt;
      if(item.position !== index || previousItem !== previous) {
        this.setProperty(item, "position", index);
        this.setProperty(item, "vorigeAgendapunt", previous);
        const treatment = yield item.treatment;
        if(treatment) {
          const previousTreatment = yield previous.treatment;
          this.setProperty(treatment, "vorigeBehandelingVanAgendapunt", previousTreatment);
        }
      }
      previous = item;
    }
  }

  /**
   * Save all items with changed attributes in the array
   * @private
   */
  @task
  * saveItemsTask() {
    yield all([...this.changeSet].map(model => model.save()));
    this.changeSet.clear();
    yield this.args.onSave();
  }


  /**
   * Set a property on an ember data model and track its changes.
   * The reason for this is that hasDirtyAttributes does not track
   * relationship changes.
   *
   * @param {Model} model
   * @param {string} property
   * @param {unknown} value
   * @private
   */
  setProperty(model, property, value) {
    if(value !== model.get(property)) {
      this.changeSet.add(model);
    }
    model.set(property, value);
  }
}
