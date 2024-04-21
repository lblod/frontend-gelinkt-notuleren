import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { getOwner } from '@ember/application';

import {
  em,
  strikethrough,
  strong,
  subscript,
  superscript,
  underline,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import {
  block_rdfa,
  docWithConfig,
  hard_break,
  horizontal_rule,
  invisible_rdfa,
  paragraph,
  repaired_block,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import {
  tableKeymap,
  tableNodes,
  tablePlugins,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  link,
  linkView,
  linkPasteHandler,
} from '@lblod/ember-rdfa-editor/plugins/link';
import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import {
  STRUCTURE_NODES,
  STRUCTURE_SPECS,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin/structures';
import {
  bulletListWithConfig,
  listItemWithConfig,
  listTrackingPlugin,
  orderedListWithConfig,
} from '@lblod/ember-rdfa-editor/plugins/list';
import { placeholder } from '@lblod/ember-rdfa-editor/plugins/placeholder';
import { heading } from '@lblod/ember-rdfa-editor/plugins/heading';
import { blockquote } from '@lblod/ember-rdfa-editor/plugins/blockquote';
import { code_block } from '@lblod/ember-rdfa-editor/plugins/code';
import { image, imageView } from '@lblod/ember-rdfa-editor/plugins/image';
import { inline_rdfa } from '@lblod/ember-rdfa-editor/marks';
import { Schema } from '@lblod/ember-rdfa-editor';
import {
  createInvisiblesPlugin,
  hardBreak,
  heading as headingInvisible,
  paragraph as paragraphInvisible,
} from '@lblod/ember-rdfa-editor/plugins/invisibles';
import { emberApplication } from '@lblod/ember-rdfa-editor/plugins/ember-application';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';
import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';
import {
  STRUCTURE_NODES,
  STRUCTURE_SPECS,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin/structures';
import {
  address,
  addressView,
  codelist,
  codelistView,
  date,
  dateView,
  number,
  numberView,
  location,
  locationView,
  text_variable,
  textVariableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';
import { citationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import {
  tableOfContentsView,
  table_of_contents,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin/nodes';
import { document_title } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/document-title-plugin/nodes';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';

import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import {
  GEMEENTE,
  OCMW,
} from '../../utils/bestuurseenheid-classificatie-codes';

export default class RegulatoryStatementsRoute extends Controller {
  @service documentService;
  @service store;
  @service currentSession;
  @tracked controller;
  @tracked _editorDocument;
  @tracked revisions;
  @service intl;
  editor;
  @tracked citationPlugin = citationPlugin(this.config.citation);

  schema = new Schema({
    nodes: {
      doc: docWithConfig({
        content:
          'table_of_contents? document_title? ((chapter|block)+|(title|block)+|(article|block)+)',
      }),
      paragraph,
      document_title,
      table_of_contents: table_of_contents(this.config.tableOfContents),
      repaired_block,
      list_item: listItemWithConfig({ enableHierarchicalList: true }),
      ordered_list: orderedListWithConfig({ enableHierarchicalList: true }),
      bullet_list: bulletListWithConfig({ enableHierarchicalList: true }),
      placeholder,
      templateComment,
      ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
      date: date(this.config.date),
      codelist,
      location,
      address,
      number,
      text_variable,
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
      link: link(this.config.link),
    },
    marks: {
      inline_rdfa,
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

  get nodeViews() {
    return (controller) => {
      return {
        table_of_contents: tableOfContentsView(this.config.tableOfContents)(
          controller,
        ),
        link: linkView(this.config.link)(controller),
        image: imageView(controller),
        address: addressView(controller),
        date: dateView(this.config.date)(controller),
        number: numberView(controller),
        location: locationView(controller),
        codelist: codelistView(controller),
        text_variable: textVariableView(controller),
        templateComment: templateCommentView(controller),
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
      emberApplication({ application: getOwner(this) }),
      listTrackingPlugin(),
    ];
  }

  get activeNode() {
    if (this.controller) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
  }
  get config() {
    const municipality = this.defaultMunicipality;
    return {
      tableOfContents: [
        {
          nodeHierarchy: [
            'title|chapter|section|subsection|article',
            'structure_header|article_header',
          ],
          scrollContainer: () =>
            document.getElementsByClassName('say-container__main')[0],
        },
      ],
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
          return new Set([schema.nodes.doc]);
        },
        endpoint: '/codex/sparql',
        decisionsEndpoint: ENV.publicatieEndpoint,
        defaultDecisionsGovernmentName: municipality.naam,
      },
      link: {
        interactive: true,
      },
      structures: STRUCTURE_SPECS,
      worship: {
        endpoint: 'https://data.lblod.info/sparql',
        defaultAdministrativeUnit: municipality && {
          label: municipality.naam,
          uri: municipality.uri,
        },
      },
      snippet: {
        endpoint: ENV.regulatoryStatementEndpoint,
      },
    };
  }

  fetchRevisions = task(async () => {
    const revisionsToSkip = [this.editorDocument.id];
    this.revisions = await this.documentService.fetchRevisions.perform(
      this.documentContainer.id,
      revisionsToSkip,
      5,
    );
  });

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

  get defaultMunicipality() {
    const classificatie = this.currentSession.classificatie;

    if (classificatie?.uri === GEMEENTE || classificatie?.uri === OCMW) {
      return this.currentSession.group;
    } else {
      return null;
    }
  }

  @action
  download() {
    this.editorDocument.content = this.controller.htmlContent;
    generateExportFromEditorDocument(this.editorDocument);
  }

  saveTask = task(async () => {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.controller.htmlContent;
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          html,
          this.documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;

      const documentContainer = this.documentContainer;
      documentContainer.currentVersion = editorDocument;
      await documentContainer.save();
      this.fetchRevisions.perform();
    }
  });

  onTitleUpdate = task(async (title) => {
    const html = this.editorDocument.content;
    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument,
      );
    this._editorDocument = editorDocument;
  });

  @action
  handleRdfaEditorInit(controller) {
    controller.initialize(this.editorDocument.content);
    this.controller = controller;
  }
}
