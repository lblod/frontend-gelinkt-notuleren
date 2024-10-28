import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';
import { Schema } from '@lblod/ember-rdfa-editor';

import {
  em,
  strikethrough,
  strong,
  underline,
  subscript,
  superscript,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
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
  tableNodes,
  tablePlugins,
  tableKeymap,
} from '@lblod/ember-rdfa-editor/plugins/table';
import { link, linkView } from '@lblod/ember-rdfa-editor/nodes/link';
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
import { image } from '@lblod/ember-rdfa-editor/plugins/image';
import {
  date,
  dateView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';
import { linkPasteHandler } from '@lblod/ember-rdfa-editor/plugins/link';
import {
  inlineRdfaWithConfig,
  inlineRdfaWithConfigView,
} from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';

export default class MeetingsEditManualVotingController extends Controller {
  @service router;
  @tracked editor;
  @service intl;
  @service documentService;
  profile = 'none';
  @tracked _editorDocument;

  get editorDocument() {
    return (
      this._editorDocument ||
      this.documentContainer.get('currentVersion').content
    );
  }

  get documentContainer() {
    return this.model.voting.votingDocument;
  }

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.editor?.checkCommand(undo, {
      view: this.editor?.mainEditorView,
    });
  }

  clearEditor() {
    this.editor = null;
    this._editorDocument = undefined;
  }

  @action
  closeModal() {
    this.router.transitionTo('meetings.edit');
  }

  @action
  async saveAndQuit() {
    await this.saveTask.perform();
    this.clearEditor();
    this.closeModal();
  }

  saveTask = task(async () => {
    const html = this.editor.htmlContent;
    if (this.onTitleUpdate.isRunning) {
      await this.onTitleUpdate.lastRunning;
    }
    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        this.title || this.editorDocument.title,
        html,
        await this.documentContainer,
        this.editorDocument,
      );
    this._editorDocument = editorDocument;
  });

  editorOptions = {
    showToggleRdfaAnnotations: false,
    showInsertButton: false,
    showRdfa: false,
    showRdfaHighlight: false,
    showRdfaHover: false,
    showPaper: true,
    showSidebar: true,
  };

  schema = new Schema({
    nodes: {
      doc: docWithConfig({ rdfaAware: true }),
      paragraph,
      repaired_block: repairedBlockWithConfig({ rdfaAware: true }),
      list_item: listItemWithConfig({ enableHierarchicalList: true }),
      ordered_list: orderedListWithConfig({ enableHierarchicalList: true }),
      bullet_list: bulletListWithConfig({ enableHierarchicalList: true }),
      placeholder,
      ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
      date: date(this.config.date),
      heading: headingWithConfig({ rdfaAware: true }),
      blockquote,
      horizontal_rule,
      code_block,
      text,
      image,
      hard_break,
      invisible_rdfa: invisibleRdfaWithConfig({ rdfaAware: true }),
      block_rdfa: blockRdfaWithConfig({ rdfaAware: true }),
      inline_rdfa: inlineRdfaWithConfig({ rdfaAware: true }),
      link: link(this.config.link),
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

  get text() {
    return this.editorDocument.content;
  }

  onTitleUpdate = task(async (title) => {
    const html = this.editorDocument.content;

    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html,
        await this.documentContainer,
        this.editorDocument,
      );

    this._editorDocument = editorDocument;
  });

  @action
  rdfaEditorInit(editor) {
    editor.initialize(this.text, { doNotClean: true });
    this.editor = editor;
  }

  get config() {
    return {
      link: {
        interactive: true,
        rdfaAware: true,
      },
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
      lmb: {
        endpoint: '/vendor-proxy/query',
      },
    };
  }

  get plugins() {
    return [
      ...tablePlugins,
      tableKeymap,
      linkPasteHandler(this.schema.nodes.link),
      listTrackingPlugin(),
    ];
  }

  get nodeViews() {
    return (controller) => {
      return {
        link: linkView(this.config.link)(controller),
        date: dateView(this.config.date)(controller),
        inline_rdfa: inlineRdfaWithConfigView({ rdfaAware: true })(controller),
      };
    };
  }
}
