import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

import { findAncestors } from '@lblod/ember-rdfa-editor/utils/position-utils';
import { hasOutgoingNamedNodeTriple } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import {
  BESLUIT,
  RDF,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { insertHtml } from '@lblod/ember-rdfa-editor/commands/insert-html-command';
export default class RegulatoryStatementsSidebarInsertComponent extends Component {
  @tracked showModal = false;

  get controller() {
    return this.args.controller;
  }

  @action
  openModal() {
    this.controller.focus();
    this.showModal = true;
    console.log('open');
  }

  @action
  closeModal() {
    this.showModal = false;
  }

  @action
  insertCyclingRaceDecision(statement) {
    this.modalEnabled = false;
    const { schema } = this.controller;
    const html = generateHtml();
    this.controller.doCommand(insertHtml(html, 0, 0, undefined, false, true), {
      view: this.controller.mainEditorView,
    });
    this.closeModal();
  }
}

function generateHtml() {
  return `<p>Cycling race decision</p>`;
}
