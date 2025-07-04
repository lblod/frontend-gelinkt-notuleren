import Component from '@glimmer/component';
import { action } from '@ember/object';

import {
  SayController,
  Schema,
  type NodeViewConstructor,
} from '@lblod/ember-rdfa-editor';
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
import { BlockRDFaView } from '@lblod/ember-rdfa-editor/nodes/block-rdfa';
import { image } from '@lblod/ember-rdfa-editor/plugins/image';
import {
  date,
  dateView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';

import { service } from '@ember/service';
import { linkPasteHandler } from '@lblod/ember-rdfa-editor/plugins/link';
import { tracked } from '@glimmer/tracking';
import {
  inlineRdfaWithConfig,
  inlineRdfaWithConfigView,
} from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';
import { emberApplication } from '@lblod/ember-rdfa-editor/plugins/ember-application';
import type IntlService from 'ember-intl/services/intl';
import { getOwner } from '@ember/owner';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { hash } from '@ember/helper';

import RdfaEditorContainer from './rdfa-editor-container';
import DateInsertComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/date/insert';
import DateEditComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/date/edit';
import t from 'ember-intl/helpers/t';

type Signature = {
  Args: {
    type: string;
    text: string;
    onEditorInit: (controller: SayController) => unknown;
    saving?: boolean;
  };
};
export default class ZittingTextDocumentContainerComponent extends Component<Signature> {
  @service declare intl: IntlService;
  profile = 'none';
  @tracked editor?: SayController;
  type = this.args.type;

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
      heading: headingWithConfig({ rdfaAware: false }),
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
    return this.args.text;
  }

  @action
  rdfaEditorInit(editor: SayController) {
    editor.initialize(this.text, { doNotClean: true });
    this.editor = editor;
    this.args.onEditorInit(editor);
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
    };
  }

  get plugins() {
    return [
      ...tablePlugins,
      tableKeymap,
      linkPasteHandler(this.schema.nodes.link),
      listTrackingPlugin(),
      emberApplication({ application: unwrap(getOwner(this)) }),
    ];
  }

  get nodeViews() {
    return (controller: SayController) => {
      return {
        link: linkView(this.config.link)(controller),
        date: dateView(this.config.date)(controller),
        inline_rdfa: inlineRdfaWithConfigView({ rdfaAware: true })(controller),
        block_rdfa: (...args: Parameters<NodeViewConstructor>) =>
          new BlockRDFaView(args, controller),
      };
    };
  }

  <template>
    <RdfaEditorContainer
      @profile={{this.profile}}
      @rdfaEditorInit={{this.rdfaEditorInit}}
      @editorOptions={{this.editorOptions}}
      @busy={{@saving}}
      @busyText={{t 'rdfa-editor-container.saving'}}
      @prefix={{hash ext='http://mu.semte.ch/vocabularies/ext/'}}
      @property={{@type}}
      @schema={{this.schema}}
      @plugins={{this.plugins}}
      {{! @glint-expect-error }}
      @nodeViews={{this.nodeViews}}
    >
      <:sidebarCollapsible as |container|>
        <DateInsertComponent @controller={{container.controller}} />
      </:sidebarCollapsible>
      <:sidebar as |container|>
        <DateEditComponent
          @controller={{container.controller}}
          @options={{this.config.date}}
        />
      </:sidebar>
    </RdfaEditorContainer>
  </template>
}
