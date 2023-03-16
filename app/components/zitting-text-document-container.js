import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
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
} from '@lblod/ember-rdfa-editor/nodes';
import {
  tableNodes,
  tablePlugin,
} from '@lblod/ember-rdfa-editor/plugins/table';
import { link, linkView } from '@lblod/ember-rdfa-editor/nodes/link';
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

import { doc } from '@lblod/ember-rdfa-editor/nodes';

import { tableMenu } from '@lblod/ember-rdfa-editor/plugins/table';

import {
  rdfaDateCardWidget,
  rdfaDateInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin';
import { inject as service } from '@ember/service';
import { PLUGIN_CONFIGS } from '../config/constants';
import { linkPasteHandler } from '@lblod/ember-rdfa-editor/plugins/link';

export default class ZittingTextDocumentContainerComponent extends Component {
  @service intl;
  profile = 'none';
  editor;
  type = this.args.type;

  editorOptions = {
    showToggleRdfaAnnotations: false,
    showInsertButton: false,
    showRdfa: false,
    showRdfaHighlight: false,
    showRdfaHover: false,
    showPaper: true,
    showSidebar: true,
  };

  get text() {
    const zitting = this.args.zitting;
    if (this.type === 'ext:intro') {
      return zitting.intro;
    } else if (this.type === 'ext:outro') {
      return zitting.outro;
    } else {
      return '';
    }
  }

  saveText = task(async () => {
    const zitting = this.args.zitting;

    if (this.type === 'ext:intro') {
      zitting.intro = this.editor.htmlContent;
    } else if (this.type === 'ext:outro') {
      zitting.outro = this.editor.htmlContent;
    }
    await zitting.save();
  });

  @action
  rdfaEditorInit(editor) {
    editor.setHtmlContent(this.text);
    this.editor = editor;
    this.args.onEditorInit(editor);
  }

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
      },
    });
  }

  get config() {
    return {
      link: {
        interactive: true,
      },
    };
  }

  get plugins() {
    return [tablePlugin, tableKeymap, linkPasteHandler(this.schema.nodes.link)];
  }

  get widgets() {
    return [
      tableMenu,
      rdfaDateCardWidget(PLUGIN_CONFIGS.date(this.intl)),
      rdfaDateInsertWidget(PLUGIN_CONFIGS.date(this.intl)),
    ];
  }

  get nodeViews() {
    return (controller) => {
      return {
        link: linkView(this.config.link)(controller),
      };
    };
  }
}
