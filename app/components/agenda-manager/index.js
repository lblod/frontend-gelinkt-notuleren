import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';
import {task} from "ember-concurrency-decorators";

/** @typedef {import("./AgendaData").default} AgendaData */

/**
 * @typedef {Object} Args
 * @property {string} zittingId
 */


/** @extends {Component<Args>} */
export default class AgendaManagerIndexComponent extends Component {
  /** @type AgendaData */
  @tracked popup = false;
  @tracked editModalVisible = false;
  @tracked itemToEdit = null;

  constructor(...args) {
    super(...args);
  }



  @action
  openModal() {
    this.editModalVisible = true;
  }

  @action
  closeModal() {
    this.editModalVisible = false;
  }

  @task
  * createItemTask(newItemTask) {
    const newItem = yield newItemTask.perform();
    this.editItem(newItem);
  }
  @action
  cancelEdit() {
    this.closeModal();
    this.itemToEdit = null;
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
