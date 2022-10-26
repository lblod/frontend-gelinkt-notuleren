import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked modalEnabled = false;

  @action
  toggleModal() {
    this.modalEnabled = !this.modalEnabled;
  }

  @action
  insertRegulatoryStatement(_statement) {
    this.modalEnabled = false;
  }
}
