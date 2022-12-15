import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked modalEnabled = false;

  get controller() {
    return this.args.controller;
  }

  get insertRange() {
    const selection = this.controller.state.selection;
    const limitedDatastore = this.controller.datastore.limitToRange(
      this.controller.state,
      selection.from,
      selection.to
    );
    const besluitNode = [
      ...limitedDatastore
        .match(null, 'a', 'besluit:Besluit')
        .asSubjectNodeMapping()
        .nodes(),
    ][0];
    if (besluitNode) {
      const { pos, node } = besluitNode;
      return { from: pos + node.nodeSize - 1, to: pos + node.nodeSize - 1 };
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
      this.controller.withTransaction((tr) => {
        return tr.replaceRangeWith(
          this.insertRange.from,
          this.insertRange.to,
          schema.node('regulatoryStatementNode', {
            resource: statement.uri,
          })
        );
      });
    }
  }
}
