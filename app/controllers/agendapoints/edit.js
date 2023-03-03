import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { Schema } from '@lblod/ember-rdfa-editor';
import {
  em,
  strikethrough,
  strong,
  underline,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import {
  block_rdfa,
  hard_break,
  horizontal_rule,
  invisible_rdfa,
  paragraph,
  repaired_block,
  text,
  doc,
} from '@lblod/ember-rdfa-editor/nodes';
import {
  tableNodes,
  tablePlugin,
} from '@lblod/ember-rdfa-editor/plugins/table';
import { link, linkView } from '@lblod/ember-rdfa-editor/nodes/link';
import { STRUCTURE_NODES } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin/structures';
import {
  variable,
  variableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/nodes';
import {
  bullet_list,
  list_item,
  ordered_list,
} from '@lblod/ember-rdfa-editor/plugins/list';
import { placeholder } from '@lblod/ember-rdfa-editor/plugins/placeholder';
import { heading } from '@lblod/ember-rdfa-editor/plugins/heading';
import { blockquote } from '@lblod/ember-rdfa-editor/plugins/blockquote';
import { code_block } from '@lblod/ember-rdfa-editor/plugins/code';
import { image } from '@lblod/ember-rdfa-editor/plugins/image';
import { inline_rdfa } from '@lblod/ember-rdfa-editor/marks';
import date from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin/nodes/date';

import { tableKeymap } from '@lblod/ember-rdfa-editor/plugins/table';

import {
  besluitNodes,
  structureSpecs,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin';

import { citation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin/marks/citation';
import { citationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';

import {
  regulatoryStatementNode,
  regulatoryStatementNodeView,
} from '../../editor-plugins/regulatory-statements-plugin';
import { roadsign_regulation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/nodes';

export default class AgendapointsEditController extends Controller {
  @service store;
  @service router;
  @service documentService;
  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument;
  @tracked controller;
  @service intl;
  @service features;
  @tracked citationPlugin = citationPlugin(this.config.citation);

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
        ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
        date: date({
          placeholder: {
            insertDate: this.intl.t('date-plugin.insert.date'),
            insertDateTime: this.intl.t('date-plugin.insert.datetime'),
          },
        }),
        STRUCTURE_NODES,
        regulatoryStatementNode,
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
        invisible_rdfa,
        block_rdfa,
        link: link(this.config.link),
      },
      marks: {
        citation,
        inline_rdfa,
        em,
        strong,
        underline,
        strikethrough,
      },
    });
  }

  get config() {
    return {
      date: {
        placeholder: {
          insertDate: this.intl.t('date-plugin.insert.date'),
          insertDateTime: this.intl.t('date-plugin.insert.datetime'),
        },
        formats: [
          {
            label: 'Short Date',
            key: 'short',
            dateFormat: 'dd/MM/yy',
            dateTimeFormat: 'dd/MM/yy HH:mm',
          },
          {
            label: 'Long Date',
            key: 'long',
            dateFormat: 'EEEE dd MMMM yyyy',
            dateTimeFormat: 'PPPPp',
          },
        ],
        allowCustomFormat: true,
      },
      citation: {
        type: 'nodes',
        activeInNodeTypes(schema) {
          return new Set([schema.nodes.motivering]);
        },
      },
      link: {
        interactive: true,
      },
      structures: structureSpecs,
    };
  }

  get nodeViews() {
    return (controller) => {
      return {
        variable: variableView(controller),
        regulatoryStatementNode: regulatoryStatementNodeView(controller),
        link: linkView(this.config.link)(controller),
      };
    };
  }

  get plugins() {
    return [tablePlugin, tableKeymap, this.citationPlugin];
  }

  get dirty() {
    return this.editorDocument.content !== this.controller?.htmlContent;
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  @action
  handleRdfaEditorInit(editor) {
    this.controller = editor;
    editor.setHtmlContent(this.editorDocument.content || '');
  }

  @action
  download() {
    this.editorDocument.content = this.controller.htmlContent;
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
      const html = this.controller.htmlContent;
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
