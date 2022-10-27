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
  insertRegulatoryStatement(statement) {
    this.modalEnabled = false;
    const besluit = this.args.controller.datastore
      .match(null, 'a', `besluit:Besluit`)
      .asSubjectNodes()
      .next().value;
    if (besluit) {
      const besluitNode = [...besluit.nodes][0];
      const range = this.args.controller.rangeFactory.fromInNode(
        besluitNode,
        besluitNode.getMaxOffset()
      );
      this.args.controller.executeCommand(
        'insert-component',
        'editor-plugins/regulatory-statements/view',
        {
          reglementContainerURI: statement.uri,
        },
        {},
        true,
        range
      );
    }
  }
}
