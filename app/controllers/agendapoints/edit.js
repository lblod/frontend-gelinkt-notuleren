import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { Schema } from '@lblod/ember-rdfa-editor';

import {
  block_rdfa,
  blockquote,
  bullet_list,
  code_block,
  doc,
  hard_break,
  heading,
  horizontal_rule,
  image,
  inline_rdfa,
  list_item,
  ordered_list,
  paragraph,
  placeholder,
  repaired_block,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import { invisible_rdfa } from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';
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

import { besluitTypeWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin';
import { importSnippetWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/import-snippet-plugin';
import {
  rdfaDateCardWidget,
  rdfaDateInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin';
import {
  besluitNodes,
  standardTemplateWidget,
  structureSpecs,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';
import { roadSignRegulationWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin';
import { templateVariableWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin';

import { setupCitationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';

import {
  regulatoryStatementNode,
  regulatoryStatementNodeView,
  regulatoryStatementWidget,
} from '../../editor-plugins/regulatory-statements-plugin';
import { date } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin/nodes';
import {
  variable,
  variableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/nodes';
import { roadsign_regulation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/nodes';
import {
  articleStructureContextWidget,
  articleStructureInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin';
import { besluitPluginCardWidget } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-plugin';
import { PLUGIN_CONFIGS } from '../../config/constants';

const citation = setupCitationPlugin({
  type: 'nodes',
  activeInNodeTypes(schema) {
    return new Set([schema.nodes.motivering]);
  },
});

export default class AgendapointsEditController extends Controller {
  @service store;
  @service router;
  @service documentService;
  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument;
  @tracked editor;
  @service intl;

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
        date: date({
          placeholder: {
            insertDate: this.intl.t('date-plugin.insert.date'),
            insertDateTime: this.intl.t('date-plugin.insert.datetime'),
          },
        }),
        variable,
        ...besluitNodes,
        roadsign_regulation,
        heading,
        blockquote,
        horizontal_rule,
        code_block,
        text,
        image,
        hard_break,
        regulatoryStatementNode,
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

  get nodeViews() {
    return (controller) => {
      return {
        variable: variableView(controller),
        regulatoryStatementNode: regulatoryStatementNodeView(controller),
      };
    };
  }

  get widgets() {
    return [
      besluitPluginCardWidget,
      tableMenu,
      besluitTypeWidget,
      importSnippetWidget,
      rdfaDateCardWidget(PLUGIN_CONFIGS.date(this.intl)),
      rdfaDateInsertWidget,
      standardTemplateWidget,
      citation.widgets.citationCard,
      citation.widgets.citationInsert,
      roadSignRegulationWidget,
      templateVariableWidget,
      regulatoryStatementWidget,
      articleStructureInsertWidget(structureSpecs),
      articleStructureContextWidget(structureSpecs),
    ];
  }

  get plugins() {
    return [tablePlugin, citation.plugin];
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
      const cleanedHtml = this.removeEmptyDivs(html);

      const editorDocument =
        yield this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          cleanedHtml,
          this.documentContainer,
          this.editorDocument
        );
      this._editorDocument = editorDocument;
    }
  }

  removeEmptyDivs(html) {
    const parserInstance = new DOMParser();
    const parsedHtml = parserInstance.parseFromString(html, 'text/html');
    const besluitIdentifiers = {
      prefixed: 'besluit:Besluit',
      full: 'http://data.vlaanderen.be/ns/besluit#Besluit',
    };
    const besluitDivs = parsedHtml.querySelectorAll(
      `div[typeof~="${besluitIdentifiers.prefixed}"], div[typeof~="${besluitIdentifiers.full}"]`
    );
    besluitDivs.forEach((besluitDiv) => {
      if (besluitDiv.textContent.trim() === '') {
        besluitDiv.remove();
      }
    });

    return parsedHtml.body.innerHTML;
  }
}
