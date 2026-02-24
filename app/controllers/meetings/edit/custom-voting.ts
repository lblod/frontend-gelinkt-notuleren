import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { getOwner } from '@ember/owner';
import { SayController, Schema } from '@lblod/ember-rdfa-editor';

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
  person_variable,
  personVariableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';
import { linkPasteHandler } from '@lblod/ember-rdfa-editor/plugins/link';
import {
  inlineRdfaWithConfig,
  inlineRdfaWithConfigView,
} from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';
import { emberApplication } from '@lblod/ember-rdfa-editor/plugins/ember-application';
import type RouterService from '@ember/routing/router-service';
import type IntlService from 'ember-intl/services/intl';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsEditCustomVotingRoute from 'frontend-gelinkt-notuleren/routes/meetings/edit/custom-voting';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type { PromiseBelongsTo } from '@ember-data/model/-private';

export default class MeetingsEditManualVotingController extends Controller {
  declare model: ModelFrom<MeetingsEditCustomVotingRoute>;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare documentService: DocumentService;
  profile = 'none';
  @tracked editor?: SayController | null;
  @tracked _editorDocument?: EditorDocumentModel;

  get editorDocument(): EditorDocumentModel | null {
    return (
      this._editorDocument ||
      this.documentContainer.get('currentVersion').content
    );
  }

  get documentContainer(): PromiseBelongsTo<DocumentContainerModel> {
    return this.model.voting.votingDocument;
  }

  get dirty() {
    return this.editor?.isDirty;
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
    this.closeModal();
  }

  saveTask = task(async () => {
    const documentContainer = await this.documentContainer;
    if (this.editor && this.editorDocument && documentContainer) {
      const html = this.editor?.htmlContent;
      if (this.onTitleUpdate.isRunning) {
        await this.onTitleUpdate.lastRunning;
      }
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title ?? '',
          html,
          documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;
      this.editor?.setHtmlContent(html);
      this.editor?.markClean();
    }
  });

  editorOptions = {
    showInsertButton: false,
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
      person_variable,
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
    return this.editorDocument?.content;
  }

  onTitleUpdate = task(async (title: string) => {
    const html = this.editorDocument?.content;
    const documentContainer = await this.documentContainer;

    if (documentContainer && this.editorDocument) {
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          title,
          html ?? '',
          documentContainer,
          this.editorDocument,
        );

      this._editorDocument = editorDocument;
    }
  });

  @action
  rdfaEditorInit(editor: SayController) {
    editor.initialize(this.text ?? '', { doNotClean: true });
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
        // not raw-sparql as this is quite a slow query
        // and the Person instances in LMB aren't likely to change very much
        endpoint: '/sparql',
      },
    };
  }

  get plugins() {
    return [
      ...tablePlugins,
      tableKeymap,
      linkPasteHandler(this.schema.nodes.link),
      // @ts-expect-error emberApplication should accept undefined as getOwner may return it
      emberApplication({ application: getOwner(this) }),
    ];
  }

  get nodeViews() {
    return (controller: SayController) => {
      return {
        link: linkView(this.config.link)(controller),
        date: dateView(this.config.date)(controller),
        inline_rdfa: inlineRdfaWithConfigView({ rdfaAware: true })(controller),
        person_variable: personVariableView(controller),
      };
    };
  }
}
