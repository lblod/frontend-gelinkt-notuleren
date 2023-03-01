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
  placeholder,
} from '@lblod/ember-rdfa-editor/nodes';
import { invisible_rdfa } from '@lblod/ember-rdfa-editor/marks/inline-rdfa';
import {
  em,
  link,
  strikethrough,
  strong,
  underline,
} from '@lblod/ember-rdfa-editor/marks';
import {
  tableMenu,
  tablePlugin,
  tableNodes,
  tableKeymap,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  tableOfContentsView,
  table_of_contents,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin/nodes';
import { tableOfContentsWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin';
import { templateVariableWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin';
import { setupCitationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import {
  rdfaDateCardWidget,
  rdfaDateInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin';
import {
  articleStructureContextWidget,
  articleStructureInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin';
import { importSnippetWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/import-snippet-plugin';
import { STRUCTURE_NODES } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin/structures';
import {
  variable,
  variableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/nodes';
import { date } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin/nodes';
import { Schema } from '@lblod/ember-rdfa-editor';

const citation = setupCitationPlugin();

export default class RegulatoryStatementsRoute extends Controller {
  @service documentService;
  @service store;
  @tracked editor;
  @tracked _editorDocument;
  @tracked revisions;
  @service intl;
  editor;

  get schema() {
    return new Schema({
      nodes: {
        doc: {
          content: 'table_of_contents? ((chapter|block)+|(title|block)+)',
        },
        paragraph,
        table_of_contents: table_of_contents(PLUGIN_CONFIGS.TABLE_OF_CONTENTS),
        repaired_block,
        list_item,
        ordered_list,
        bullet_list,
        placeholder,
        ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
        date: date({
          placeholder: {
            insertDate: this.intl.t('date-plugin.insert.date'),
            insertDateTime: this.intl.t('date-plugin.insert.datetime'),
          },
        }),
        variable,
        ...STRUCTURE_NODES,
        heading,
        blockquote,
        horizontal_rule,
        code_block,
        text,
        image,
        hard_break,
        invisible_rdfa,
        block_rdfa,
      },
      marks: {
        citation: citation.marks.citation,
        inline_rdfa,
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
      tableOfContentsWidget,
      rdfaDateCardWidget(PLUGIN_CONFIGS.date(this.intl)),
      rdfaDateInsertWidget(PLUGIN_CONFIGS.date(this.intl)),
      importSnippetWidget,
      citation.widgets.citationCard,
      citation.widgets.citationInsert,
      articleStructureContextWidget(),
      articleStructureInsertWidget(),
      templateVariableWidget,
    ];
  }

  get nodeViews() {
    return (controller) => {
      return {
        variable: variableView(controller),
        table_of_contents: tableOfContentsView(
          PLUGIN_CONFIGS.TABLE_OF_CONTENTS
        )(controller),
      };
    };
  }

  get plugins() {
    return [tablePlugin, tableKeymap, citation.plugin];
  }

  @task
  *fetchRevisions() {
    const revisionsToSkip = [this.editorDocument.id];
    this.revisions = yield this.documentService.fetchRevisions.perform(
      this.documentContainer.id,
      revisionsToSkip,
      5
    );
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

      const documentContainer = this.documentContainer;
      documentContainer.currentVersion = editorDocument;
      yield documentContainer.save();
      this.fetchRevisions.perform();
    }
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

  @action
  handleRdfaEditorInit(controller) {
    controller.setHtmlContent(this.editorDocument.content);
    this.editor = controller;
  }
}
