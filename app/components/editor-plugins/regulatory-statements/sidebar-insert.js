import { findParentNodeOfType } from '@curvenote/prosemirror-utils';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { findAncestors } from '@lblod/ember-rdfa-editor/utils/position-utils';
import {
  hasOutgoingNamedNodeTriple,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import {
  BESLUIT,
  RDF,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked modalEnabled = false;

  get controller() {
    return this.args.controller;
  }

  get decisionNodeLocation(){
    return (
      findAncestors(this.controller.mainEditorState.selection.$from, (node) => {
        return hasOutgoingNamedNodeTriple(
          node.attrs,
          RDF('type'),
          BESLUIT('Besluit'),
        );
      })[0] ?? null
    );
  }
  get insertRange() {
    const besluit = this.decisionNodeLocation;
    if (besluit) {
      const { node, pos } = besluit;
      const endOfDecision = pos + node.nodeSize - 2;
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
            }),
          );
        },
        { view: this.controller.mainEditorView },
      );
    }
  }
}
