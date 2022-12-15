import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { Schema } from '@lblod/ember-rdfa-editor';

import {
  doc,
  block_rdfa,
  blockquote,
  bullet_list,
  code_block,
  hard_break,
  heading,
  horizontal_rule,
  image,
  inline_rdfa,
  list_item,
  ordered_list,
  paragraph,
  repaired_block,
  text,
} from '@lblod/ember-rdfa-editor/nodes';

import {
  em,
  link,
  strikethrough,
  strong,
  underline,
} from '@lblod/ember-rdfa-editor/marks';

import {
  tableMenu,
  tableNodes,
  tablePlugin,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  placeholder,
  placeholderEditing,
  placeholderView,
} from '@lblod/ember-rdfa-editor/plugins/placeholder';

import { besluitTypeWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin';
import { importSnippetWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/import-snippet-plugin';
import {
  rdfaDateCardWidget,
  rdfaDateInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin';
import { standardTemplateWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';
import { roadSignRegulationWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin';
import { templateVariableWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-variable-plugin';

import { setupCitationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';

const citation = setupCitationPlugin();

export default class AgendapointsEditController extends Controller {
  @service store;
  @service router;
  @service documentService;
  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument;
  @tracked editor;

  get schema() {
    return new Schema({
      nodes: {
        doc,
        paragraph,
        repaired_block,
        list_item,
        ordered_list,
        bullet_list,
        placeholder,
        ...tableNodes({ tableGroup: 'block', cellContent: 'inline*' }),
        heading,
        blockquote,
        horizontal_rule,
        code_block,
        text,
        image,
        hard_break,
        inline_rdfa,
        block_rdfa,
      },
      marks: {
        citation: citation.marks.citation,
        link,
        em,
        strong,
        underline,
        strikethrough,
      },
    });
  }

  get nodeViews() {
    return () => {
      return {
        placeholder: placeholderView,
      };
    };
  }

  get widgets() {
    return [
      tableMenu,
      besluitTypeWidget,
      importSnippetWidget,
      rdfaDateCardWidget,
      rdfaDateInsertWidget,
      standardTemplateWidget,
      citation.widgets.citationCard,
      citation.widgets.citationInsert,
      roadSignRegulationWidget,
      templateVariableWidget,
    ];
  }

  get plugins() {
    return [placeholderEditing(), tablePlugin, citation.plugin];
  }

  get dirty() {
    return this.editorDocument.content !== this.editor.htmlContent;
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  @action
  handleRdfaEditorInit(editor) {
    this.editor = editor;
    editor.setHtmlContent(this.editorDocument.content || '');
  }

  @action
  download() {
    this.editorDocument.content = this.editor.htmlContent;
    generateExportFromEditorDocument(this.editorDocument);
  }

  @task
  *copyAgendapunt() {
    const response = yield fetch(
      `/agendapoint-service/${this.documentContainer.id}/copy`,
      { method: 'POST' }
    );
    const json = yield response.json();
    const agendapuntId = json.uuid;
    yield this.router.transitionTo('agendapoints.edit', agendapuntId);
  }

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
      TRASH_STATUS_ID
    );
    container.status = deletedStatus;
    await container.save();
    this.displayDeleteModal = false;
    this.router.transitionTo('inbox.agendapoints');
  }

  @task
  *onTitleUpdate(title) {
    const html = this.editorDocument.content;
    const editorDocument =
      yield this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument
      );
    this._editorDocument = editorDocument;
  }

  @task
  *saveTask() {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.editor.htmlContent;
      const editorDocument =
        yield this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          html,
          this.documentContainer,
          this.editorDocument
        );
      this._editorDocument = editorDocument;
    }
  }
}
