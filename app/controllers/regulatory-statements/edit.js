import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

import { task } from 'ember-concurrency';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { inject as service } from '@ember/service';

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
  tablePlugin,
} from '@lblod/ember-rdfa-editor/plugins/table';
import { link, linkView } from '@lblod/ember-rdfa-editor/plugins/link';
import {
  STRUCTURE_NODES,
  STRUCTURE_SPECS,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/article-structure-plugin/structures';
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
import { image, imageView } from '@lblod/ember-rdfa-editor/plugins/image';
import { inline_rdfa } from '@lblod/ember-rdfa-editor/marks';
import date from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin/nodes/date';

import { Schema } from '@lblod/ember-rdfa-editor';

import { citationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import {
  createInvisiblesPlugin,
  hardBreak,
  heading as headingInvisible,
  paragraph as paragraphInvisible,
  space,
} from '@lblod/ember-rdfa-editor/plugins/invisibles';
import {
  tableOfContentsView,
  table_of_contents,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin/nodes';

import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
import { linkPasteHandler } from '@lblod/ember-rdfa-editor/plugins/link';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { extractOutline } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin/utils';

export default class RegulatoryStatementsRoute extends Controller {
  @service documentService;
  @service store;
  @tracked controller;
  @tracked _editorDocument;
  @tracked revisions;
  @service intl;
  editor;
  @tracked citationPlugin = citationPlugin(this.config.citation);

  schema = new Schema({
    nodes: {
      doc: {
        content: 'table_of_contents? ((chapter|block)+|(title|block)+)',
      },
      paragraph,
      table_of_contents: table_of_contents(this.config.tableOfContents),
      repaired_block,
      list_item,
      ordered_list,
      bullet_list,
      placeholder,
      ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
      date: date(this.config.date),
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
        variable: variableView(controller),
        table_of_contents: tableOfContentsView(this.config.tableOfContents)(
          controller
        ),
        link: linkView(this.config.link)(controller),
        image: imageView(controller),
      };
    };
  }

  get plugins() {
    return [
      tablePlugin,
      tableKeymap,
      this.citationPlugin,
      createInvisiblesPlugin(
        [space, hardBreak, paragraphInvisible, headingInvisible],
        {
          shouldShowInvisibles: false,
        }
      ),
      linkPasteHandler(this.schema.nodes.link),
    ];
  }

  get config() {
    return {
      tableOfContents: [
        {
          nodeHierarchy: [
            'title|chapter|section|subsection|article',
            'structure_header|article_header',
          ],
        },
      ],
      date: {
        placeholder: {
          insertDate: this.intl.t('date-plugin.insert.date'),
          insertDateTime: this.intl.t('date-plugin.insert.datetime'),
        },
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
      },
      templateVariable: {
        endpoint: ENV.templateVariablePlugin.endpoint,
        zonalLocationCodelistUri:
          ENV.templateVariablePlugin.zonalLocationCodelistUri,
        nonZonalLocationCodelistUri:
          ENV.templateVariablePlugin.nonZonalLocationCodelistUri,
      },
      link: {
        interactive: true,
      },
      structures: STRUCTURE_SPECS,
    };
  }

  fetchRevisions = task(async () => {
    const revisionsToSkip = [this.editorDocument.id];
    this.revisions = await this.documentService.fetchRevisions.perform(
      this.documentContainer.id,
      revisionsToSkip,
      5
    );
  });

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
  download() {
    this.editorDocument.content = this.controller.htmlContent;
    generateExportFromEditorDocument(this.editorDocument);
  }

  tableOfContentsRange() {
    let result;
    this.controller.mainEditorState.doc.descendants((node, pos) => {
      if (node.type === this.controller.schema.nodes['table_of_contents']) {
        result = { from: pos };
      }
      return !result;
    });

    return result;
  }

  outline() {
    return {
      entries: extractOutline({
        node: this.controller.mainEditorState.doc,
        pos: -1,
        config: this.config.tableOfContents,
      }),
    };
  }

  createTableOfContentHTML() {
    const tocRange = this.tableOfContentsRange();
    if (tocRange) {
      const { from } = tocRange;
      this.controller.withTransaction((tr) => {
        tr.setNodeMarkup(from, null, {
          ...this.config.tableOfContents,
          ...this.outline(),
        });
        return tr;
      });
    }
  }

  saveTask = task(async () => {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      this.createTableOfContentHTML();
      const html = this.controller.htmlContent;
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
        this.editorDocument
      );
    this._editorDocument = editorDocument;
  });

  @action
  handleRdfaEditorInit(controller) {
    controller.setHtmlContent(this.editorDocument.content);
    this.controller = controller;
    this.createTableOfContentHTML();
  }
}
