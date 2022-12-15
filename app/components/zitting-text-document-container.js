import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';
import { Schema } from '@lblod/ember-rdfa-editor';

import {
  doc,
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
} from '@lblod/ember-rdfa-editor/nodes';

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

import {
  placeholder,
  placeholderEditing,
  placeholderView,
} from '@lblod/ember-rdfa-editor/plugins/placeholder';

import {
  rdfaDateCardWidget,
  rdfaDateInsertWidget,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/rdfa-date-plugin';

export default class ZittingTextDocumentContainerComponent extends Component {
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

  @task
  *saveText() {
    const zitting = this.args.zitting;

    if (this.type === 'ext:intro') {
      zitting.intro = this.editor.htmlContent;
    } else if (this.type === 'ext:outro') {
      zitting.outro = this.editor.htmlContent;
    }
    yield zitting.save();
  }

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
        ...tableNodes({ tableGroup: 'block', cellContent: 'inline*' }),
        heading,
        blockquote,

        horizontal_rule,
        code_block,

        text,

        image,

        hard_break,
        inline_rdfa,
        block_rdfa,
      },
      marks: {
        link,
        em,
        strong,
        underline,
        strikethrough,
      },
    });
  }

  get plugins() {
    return [placeholderEditing(), tablePlugin];
  }

  get widgets() {
    return [tableMenu, rdfaDateCardWidget, rdfaDateInsertWidget];
  }

  get nodeViews() {
    return () => {
      return {
        placeholder: placeholderView,
      };
    };
  }
}
