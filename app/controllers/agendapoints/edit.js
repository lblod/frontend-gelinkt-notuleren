import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';

import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import StructureControlCardComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/_private/control-card';
import InsertArticleComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/decision-plugin/insert-article';

import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';

import SnippetInsertRdfaComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import { fixArticleConnections } from '../../utils/fix-article-connections';

export default class AgendapointsEditController extends Controller {
  @service store;
  @service router;
  @service documentService;

  @service('editor/agendapoint') agendapointEditor;

  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument;
  @tracked controller;
  @service features;

  StructureControlCard = StructureControlCardComponent;
  InsertArticle = InsertArticleComponent;

  SnippetInsert = SnippetInsertRdfaComponent;

  config = this.agendapointEditor.config;

  nodeViews = this.agendapointEditor.nodeViews;

  citationPlugin = this.agendapointEditor.citationPlugin;

  constructor(...args) {
    super(...args);
    const { schema, plugins } =
      this.agendapointEditor.getSchemaAndPlugins(false);
    this.schema = schema;
    this.plugins = plugins;
  }

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.controller?.checkCommand(undo, {
      view: this.controller?.mainEditorView,
    });
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  get activeNode() {
    if (this.controller) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
  }

  @action
  async handleRdfaEditorInit(editor) {
    this.controller = editor;
    editor.initialize(this.editorDocument.content || '', { doNotClean: true });
    fixArticleConnections(editor);
  }

  copyAgendapunt = task(async () => {
    const response = await fetch(
      `/agendapoint-service/${this.documentContainer.id}/copy`,
      { method: 'POST' },
    );
    const json = await response.json();
    const agendapuntId = json.uuid;
    await this.router.transitionTo('agendapoints.edit', agendapuntId);
  });

  @action
  toggleDeleteModal() {
    this.displayDeleteModal = !this.displayDeleteModal;
  }

  @action
  closeValidationModal() {
    this.hasDocumentValidationErrors = false;
  }

  @action
  async deleteDocument() {
    const container = this.documentContainer;
    const deletedStatus = await this.store.findRecord(
      'concept',
      TRASH_STATUS_ID,
    );
    container.status = deletedStatus;
    await container.save();
    this.displayDeleteModal = false;
    this.router.transitionTo('inbox.agendapoints');
  }

  onTitleUpdate = task(async (title) => {
    const html = this.editorDocument.content;

    const behandeling = (
      await this.store.query('behandeling-van-agendapunt', {
        'filter[document-container][:id:]': this.model.documentContainer.id,
      })
    ).firstObject;
    if (behandeling) {
      const agendaItem = await behandeling.onderwerp;
      agendaItem.titel = title;
      await agendaItem.save();
    }

    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument,
      );

    this._editorDocument = editorDocument;
  });

  saveTask = task(async () => {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.controller.htmlContent;
      const cleanedHtml = this.removeEmptyDivs(html);

      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          cleanedHtml,
          this.documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;
    }
  });

  removeEmptyDivs(html) {
    const parserInstance = new DOMParser();
    const parsedHtml = parserInstance.parseFromString(html, 'text/html');
    const besluitIdentifiers = {
      prefixed: 'besluit:Besluit',
      full: 'http://data.vlaanderen.be/ns/besluit#Besluit',
    };
    const besluitDivs = parsedHtml.querySelectorAll(
      `div[typeof~="${besluitIdentifiers.prefixed}"], div[typeof~="${besluitIdentifiers.full}"]`,
    );
    besluitDivs.forEach((besluitDiv) => {
      if (besluitDiv.textContent.trim() === '') {
        besluitDiv.remove();
      }
    });

    return parsedHtml.body.innerHTML;
  }
}
