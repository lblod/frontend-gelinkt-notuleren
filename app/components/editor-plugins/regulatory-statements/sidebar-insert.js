import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked isDisabled = false;
  @tracked modalEnabled = false;
  @tracked besluit;

  constructor() {
    super(...arguments);
    this.args.controller.onEvent('selectionChanged', this.update.bind(this));
    this.update();
  }

  update() {
    const selectedRange = this.args.controller.selection.lastRange;
    if (!selectedRange) {
      return;
    }
    const limitedDatastore = this.args.controller.datastore.limitToRange(
      selectedRange,
      'rangeIsInside'
    );
    this.besluit = limitedDatastore
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
        true,
        range
      );
    }
  }
}
