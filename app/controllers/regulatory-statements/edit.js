import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { PLUGIN_CONFIGS } from 'frontend-gelinkt-notuleren/config/constants';
import { task } from 'ember-concurrency';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { inject as service } from '@ember/service';

import {
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
  placeholderEditing,
  placeholderView,
  placeholder,
} from '@lblod/ember-rdfa-editor/plugins/placeholder';
import {
  tableMenu,
  tablePlugin,
  tableNodes,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  tableOfContentsView,
  tableOfContents,
} from '@lblod/ember-rdfa-editor-lblod-plugins/ember-nodes/table-of-contents';
import { tableOfContentsWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin';
import { templateVariableWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-variable-plugin';
import { setupCitationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import {
  rdfaDateCardWidget,
  rdfaDateInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin';
import { importSnippetWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/import-snippet-plugin';
import { Schema } from '@lblod/ember-rdfa-editor';

const citation = setupCitationPlugin();

export default class RegulatoryStatementsRoute extends Controller {
  @service documentService;
  @tracked _editorDocument;
  editor;

  get schema() {
    return new Schema({
      nodes: {
        doc: {
          content: 'tableOfContents? block+',
        },
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
        tableOfContents,
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

  get widgets() {
    return [
      tableMenu,
      tableOfContentsWidget(PLUGIN_CONFIGS.TABLE_OF_CONTENTS),
      rdfaDateCardWidget,
      rdfaDateInsertWidget,
      importSnippetWidget,
      citation.widgets.citationCard,
      citation.widgets.citationInsert,
      templateVariableWidget,
    ];
  }

  get nodeViews() {
    return (controller) => {
      return {
        placeholder: placeholderView,
        tableOfContents: tableOfContentsView(controller),
      };
    };
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
  download() {
    this.editorDocument.content = this.editor.htmlContent;
    generateExportFromEditorDocument(this.editorDocument);
  }

  saveTask = task(async () => {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.editor.htmlContent;
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          html,
          this.documentContainer,
          this.editorDocument
        );
      this._editorDocument = editorDocument;

      const documentContainer = this.documentContainer;
      documentContainer.currentVersion = editorDocument;
      await documentContainer.save();
    }
  });

  onTitleUpdate = task(async (title) => {
    const html = this.editorDocument.content;
    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument
      );
    this._editorDocument = editorDocument;
  });

  @action
  handleRdfaEditorInit(controller) {
    controller.setHtmlContent(this.editorDocument.content);
    this.editor = controller;
  }
}
