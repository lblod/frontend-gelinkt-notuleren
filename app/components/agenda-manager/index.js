import Component from '@glimmer/component';
import {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';

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

  @action
  createItem() {
    const newItem = this.agendaData.createItem();
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
