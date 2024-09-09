import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

import { Schema } from '@lblod/ember-rdfa-editor';
import {
  em,
  strikethrough,
  strong,
  subscript,
  superscript,
  underline,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import {
  blockRdfaWithConfig,
  docWithConfig,
  hard_break,
  horizontal_rule,
  invisibleRdfaWithConfig,
  paragraph,
  repairedBlockWithConfig,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import {
  tableKeymap,
  tableNodes,
  tablePlugins,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  date,
  dateView,
  codelist,
  codelistView,
  number,
  numberView,
  location,
  locationView,
  text_variable,
  textVariableView,
  person_variable,
  personVariableView,
  autofilled_variable,
  autofilledVariableView
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';
import {
  osloLocation,
  osloLocationView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/location-plugin/node';
import {
  bulletListWithConfig,
  listItemWithConfig,
  listTrackingPlugin,
  orderedListWithConfig,
} from '@lblod/ember-rdfa-editor/plugins/list';
import { placeholder } from '@lblod/ember-rdfa-editor/plugins/placeholder';
import { headingWithConfig } from '@lblod/ember-rdfa-editor/plugins/heading';
import { blockquote } from '@lblod/ember-rdfa-editor/plugins/blockquote';
import { code_block } from '@lblod/ember-rdfa-editor/plugins/code';
import { image, imageView } from '@lblod/ember-rdfa-editor/plugins/image';
import {
  createInvisiblesPlugin,
  hardBreak,
  heading as headingInvisible,
  paragraph as paragraphInvisible,
} from '@lblod/ember-rdfa-editor/plugins/invisibles';
import { citationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import { roadsign_regulation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/nodes';
import {
  link,
  linkView,
  linkPasteHandler,
} from '@lblod/ember-rdfa-editor/plugins/link';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';

import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import {
  regulatoryStatementNode,
  regulatoryStatementNodeView,
} from '../../editor-plugins/regulatory-statements-plugin';
import {
  GEMEENTE,
  OCMW,
} from '../../utils/bestuurseenheid-classificatie-codes';
import {
  structure,
  structureView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/structure-plugin/node';
import StructureControlCardComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/_private/control-card';
import {
  inlineRdfaWithConfig,
  inlineRdfaWithConfigView,
} from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';
import InsertArticleComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/decision-plugin/insert-article';

import {
  mandatee_table,
  mandateeTableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/mandatee-table-plugin/node';

import {
  snippetPlaceholder,
  snippetPlaceholderView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet-placeholder';
import {
  snippet,
  snippetView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet';

import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';

import SnippetInsertRdfaComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import { MANDATEE_TABLE_SAMPLE_CONFIG } from '../../config/mandatee-table-config';
import { variableAutofillerPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/plugins/autofiller';
export default class AgendapointsEditController extends Controller {
  @service store;
  @service router;
  @service documentService;
  @service currentSession;

  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument;
  @tracked controller;
  @service intl;
  @service features;
  @tracked citationPlugin = citationPlugin(this.config.citation);
  StructureControlCard = StructureControlCardComponent;
  InsertArticle = InsertArticleComponent;

  SnippetInsert = SnippetInsertRdfaComponent;
  schema = new Schema({
    nodes: {
      doc: docWithConfig({ rdfaAware: true }),
      paragraph,
      repaired_block: repairedBlockWithConfig({ rdfaAware: true }),
      structure,
      list_item: listItemWithConfig({ enableHierarchicalList: true }),
      ordered_list: orderedListWithConfig({ enableHierarchicalList: true }),
      bullet_list: bulletListWithConfig({ enableHierarchicalList: true }),
      placeholder,
      ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
      date: date(this.config.date),
      regulatoryStatementNode,
      templateComment,
      text_variable,
      number,
      oslo_location: osloLocation(this.config.location),
      location,
      codelist,
      roadsign_regulation,
      mandatee_table,
      heading: headingWithConfig({ rdfaAware: true }),
      blockquote,
      snippet_placeholder: snippetPlaceholder,
      snippet: snippet(this.config.snippet),
      horizontal_rule,
      code_block,
      text,
      image,
      hard_break,
      block_rdfa: blockRdfaWithConfig({ rdfaAware: true }),
      invisible_rdfa: invisibleRdfaWithConfig({ rdfaAware: true }),
      inline_rdfa: inlineRdfaWithConfig({ rdfaAware: true }),
      link: link(this.config.link),
      person_variable,
      autofilled_variable,
    },
    marks: {
      em,
      strong,
      underline,
      strikethrough,
      subscript,
      superscript,
      highlight,
      color,
    },
  });

  get config() {
    const classificatie = this.currentSession.classificatie;
    const municipality = this.defaultMunicipality;
    return {
      date: {
        formats: [
          {
            label: this.intl.t('date-format.short-date'),
            key: 'short',
            dateFormat: 'dd/MM/yy',
            dateTimeFormat: 'dd/MM/yy HH:mm',
          },
          {
            label: this.intl.t('date-format.long-date'),
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
        endpoint: '/codex/sparql',
        decisionsEndpoint: ENV.publicatieEndpoint,
        defaultDecisionsGovernmentName: municipality.naam,
      },
      link: {
        interactive: true,
        rdfaAware: true,
      },
      roadsignRegulation: {
        endpoint: ENV.mowRegistryEndpoint,
        imageBaseUrl: ENV.roadsignImageBaseUrl,
      },
      besluitType: {
        endpoint: 'https://centrale-vindplaats.lblod.info/sparql',
        classificatieUri: classificatie?.uri,
      },
      besluitTopic: {
        endpoint: 'https://data.vlaanderen.be/sparql',
      },
      worship: {
        endpoint: 'https://data.lblod.info/sparql',
        defaultAdministrativeUnit: municipality.uri && {
          label: municipality.naam,
          uri: municipality.uri,
        },
      },

      snippet: {
        endpoint: ENV.regulatoryStatementEndpoint,
      },
      location: {
        defaultPointUriRoot:
          'https://publicatie.gelinkt-notuleren.vlaanderen.be/id/geometrie/',
        defaultPlaceUriRoot:
          'https://publicatie.gelinkt-notuleren.vlaanderen.be/id/plaats/',
        defaultAddressUriRoot:
          'https://publicatie.gelinkt-notuleren.vlaanderen.be/id/adres/',
      },
      lpdc: {
        endpoint: '/lpdc-service',
      },
      mandateeTable: {
        config: MANDATEE_TABLE_SAMPLE_CONFIG,
        tags: Object.keys(MANDATEE_TABLE_SAMPLE_CONFIG),
        defaultTag: Object.keys(MANDATEE_TABLE_SAMPLE_CONFIG)[0],
      },
      lmb: {
        endpoint: '/vendor-proxy/query',
      },
      autofilledVariable: {
        autofilledValues: {
          administrativeUnit: municipality.naam,
        }
      }
    };
  }

  get defaultMunicipality() {
    const classificatie = this.currentSession.classificatie;
    if (classificatie?.uri === GEMEENTE || classificatie?.uri === OCMW) {
      return this.currentSession.group;
    } else {
      // Return empty object instead of null so can be used safely in template
      return {};
    }
  }

  get codelistEditOptions() {
    return {
      endpoint: ENV.fallbackCodelistEndpoint,
    };
  }

  get locationEditOptions() {
    return {
      endpoint: ENV.fallbackCodelistEndpoint,
      zonalLocationCodelistUri: ENV.zonalLocationCodelistUri,
      nonZonalLocationCodelistUri: ENV.nonZonalLocationCodelistUri,
    };
  }

  get nodeViews() {
    return (controller) => {
      return {
        regulatoryStatementNode: regulatoryStatementNodeView(controller),
        link: linkView(this.config.link)(controller),
        image: imageView(controller),
        oslo_location: osloLocationView(this.config.location)(controller),
        date: dateView(this.config.date)(controller),
        number: numberView(controller),
        text_variable: textVariableView(controller),
        location: locationView(controller),
        codelist: codelistView(controller),
        templateComment: templateCommentView(controller),
        inline_rdfa: inlineRdfaWithConfigView({ rdfaAware: true })(controller),

        snippet_placeholder: snippetPlaceholderView(controller),
        snippet: snippetView(this.config.snippet)(controller),
        structure: structureView(controller),
        mandatee_table: mandateeTableView(controller),
        person_variable: personVariableView(controller),
        autofilled_variable: autofilledVariableView(controller)
      };
    };
  }

  get plugins() {
    return [
      ...tablePlugins,
      tableKeymap,
      this.citationPlugin,
      createInvisiblesPlugin(
        [hardBreak, paragraphInvisible, headingInvisible],
        {
          shouldShowInvisibles: false,
        },
      ),
      linkPasteHandler(this.schema.nodes.link),
      listTrackingPlugin(),
      variableAutofillerPlugin(this.config.autofilledVariable),
    ];
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
  handleRdfaEditorInit(editor) {
    this.controller = editor;
    editor.initialize(this.editorDocument.content || '');
  }

  @action
  download() {
    this.editorDocument.content = this.controller.htmlContent;
    generateExportFromEditorDocument(this.editorDocument);
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
