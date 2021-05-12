import Component from '@glimmer/component';
import {tracked} from '@glimmer/tracking';
import {action} from '@ember/object';

/**
 * @typedef {Object} Args
 * @property {string} zittingId
 */


/** @extends {Component<Args>} */
export default class AgendaManagerIndexComponent extends Component {
  @tracked itemToEdit = null;

  get editModalVisible() {
    return !!this.itemToEdit;
  }

  @action
  createAgendaItem(newAgendaItem) {
    const agendaItem = newAgendaItem();
    this.editItem(agendaItem);
  }

  @action
  stopEditing() {
    this.itemToEdit = null;
  }

  @action
  /**
   * @param {AgendaPunt} item
   */
  editItem(item) {
    this.itemToEdit = item;
  }
}
