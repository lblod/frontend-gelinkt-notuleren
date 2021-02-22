import {tracked} from "tracked-built-ins";
import {task} from "ember-concurrency-decorators";
import { action } from "@ember/object";
import {inject as service} from "@ember/service";

/**
 * @typedef {import("@ember-data/store).default} Store
 */

/**
 * @typedef {import("../../models/agendapunt").default} Agendapunt
 */

export default class AgendaData {
  /** @type {Array<Agendapunt>} */
  items = tracked([]);

  /** @type {string} */
  zittingId;

  /** @type {Store} */
  @service
  store;

  /**
   * @param {Store} store
   * @param {string} zittingId
   */
  constructor(store, zittingId) {
    this.zittingId = zittingId;
    this.store = store;
  }

  @task
  * load() {
    const agendapoints = [];
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
  /**
   * Create a new agenda item
   * @return {Agendapunt} the newly created item
   */
  createItem(){
    const item = this.store.createRecord("agendapunt");
    item.titel = "";
    item.beschrijving = "";
    item.geplandOpenbaar = true;
    item.position = this.zitting.agendapunten.length;
    this.items.push(item);
    return item;
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

  @task
  /**
   * Persist the agenda to the backend
   */
  * save() {

  }


}
