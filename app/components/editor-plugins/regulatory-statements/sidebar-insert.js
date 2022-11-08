import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked modalEnabled = false;

  @action
  toggleModal() {
    this.modalEnabled = !this.modalEnabled;
  }

  get besluit() {
    return this.args.controller.datastore
      .match(null, 'a', `besluit:Besluit`)
      .asSubjectNodes()
      .next().value;
  }

  get isDisabled() {
    return !this.besluit;
  }

  @action
  insertRegulatoryStatement(statement) {
    this.modalEnabled = false;
    if (this.besluit) {
      const besluitNode = [...this.besluit.nodes][0];
      const range = this.args.controller.rangeFactory.fromInNode(
        besluitNode,
        besluitNode.getMaxOffset()
      );
      this.args.controller.executeCommand(
        'insert-component',
        'editor-plugins/regulatory-statements/view',
        {
          uri: statement.uri,
        },
        {},
        true,
        range
      );
    }
  }
}
