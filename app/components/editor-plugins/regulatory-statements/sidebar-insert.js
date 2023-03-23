import { findParentNodeOfType } from '@curvenote/prosemirror-utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked modalEnabled = false;

  get controller() {
    return this.args.controller;
  }

  get insertRange() {
    const selection = this.controller.mainEditorState.selection;
    const besluit = findParentNodeOfType(this.controller.schema.nodes.besluit)(
      selection
    );
    if (besluit) {
      const { node, start } = besluit;
      const endOfDecision = start + node.nodeSize - 2;
      return { from: endOfDecision, to: endOfDecision };
    }
    return undefined;
  }

  get isDisabled() {
    return !this.insertRange;
  }

  @action
  toggleModal() {
    this.modalEnabled = !this.modalEnabled;
  }

  @action
  insertRegulatoryStatement(statement) {
    this.modalEnabled = false;
    if (this.insertRange) {
      const { schema } = this.controller;
      this.controller.withTransaction(
        (tr) => {
          return tr.replaceRangeWith(
            this.insertRange.from,
            this.insertRange.to,
            schema.node('regulatoryStatementNode', {
              resource: statement.uri,
            })
          );
        },
        { view: this.controller.mainEditorView }
      );
    }
  }
}
