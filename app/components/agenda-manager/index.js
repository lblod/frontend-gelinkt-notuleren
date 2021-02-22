import {inject as service} from '@ember/service';
import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import AgendaData from "./AgendaData";

/** @typedef {import("./AgendaData").default} AgendaData */

/**
 * @typedef {Object} Args
 * @property {string} zittingId
 */


/** @extends {Component<Args>} */
export default class AgendaManagerIndexComponent extends Component {
  @service store;
  /** @type AgendaData */
  @tracked agendaData;
  @tracked popup = false;
  @tracked editModalVisible = false;
  @tracked itemToEdit = null;

  constructor(...args) {
    super(...args);
    this.agendaData = new AgendaData(this.store, args.zittingId);
    this.agendaData.load.perform();
  }

  get agendaItems() {
    return this.agendaData.items;
  }

  @action
  openModal() {
    this.editModalVisible = true;
  }

  @action
  createNewItem() {
    console.log("click")
    this.openModal();
  }

  @action
  /**
   * @param {AgendaPunt} item
   */
  editItem(item) {
    this.itemToEdit = item;
    this.openModal();
  }


}
