import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked isDisabled = false;
  @tracked modalEnabled = false;
  @tracked besluit;

  constructor() {
    super(...arguments);
    this.args.controller.onEvent('contentChanged', this.update.bind(this));
    this.update();
  }

  update() {
    this.besluit = this.args.controller.datastore
      .match(null, 'a', `besluit:Besluit`)
      .asSubjectNodes()
      .next().value;
    this.isDisabled = !this.besluit;
  }

  @action
  toggleModal() {
    this.modalEnabled = !this.modalEnabled;
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
