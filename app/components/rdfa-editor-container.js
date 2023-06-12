import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import applyDevTools from 'prosemirror-dev-tools';
import { firefoxCursorFix } from '@lblod/ember-rdfa-editor/plugins/firefox-cursor-fix';
import { lastKeyPressedPlugin } from '@lblod/ember-rdfa-editor/plugins/last-key-pressed';
import { chromeHacksPlugin } from '@lblod/ember-rdfa-editor/plugins/chrome-hacks-plugin';

export default class RdfaEditorContainerComponent extends Component {
  @service features;
  @tracked controller;
  @tracked ready = false;

  get plugins() {
    const plugins = this.args.plugins || [];
    return plugins.concat(
      firefoxCursorFix(),
      lastKeyPressedPlugin,
      chromeHacksPlugin()
    );
  }

  get widgets() {
    return this.args.widgets || [];
  }

  get schema() {
    return this.args.schema;
  }

  get nodeViews() {
    return this.args.nodeViews;
  }

  get editorOptions() {
    return (
      this.args.editorOptions ?? {
        showToggleRdfaAnnotations: Boolean(this.args.showToggleRdfaAnnotations),
        showInsertButton: false,
        showRdfa: true,
        showRdfaHighlight: true,
        showRdfaHover: true,
        showPaper: true,
        showSidebar: true,
      }
    );
  }

  get toolbarOptions() {
    return (
      this.args.toolbarOptions ?? {
        showTextStyleButtons: true,
        showListButtons: true,
        showIndentButtons: true,
      }
    );
  }

  get documentContext() {
    if (this.args.editorDocument) {
      try {
        return JSON.parse(this.args.editorDocument.context);
      } catch (e) {
        console.warn(
          'Error encountered during parsing of document context. ' +
            'Reverting to default context.',
          e
        );
      }
    }
    return {
      prefix: this.args.prefix ?? '',
      typeof: '',
      vocab: '',
    };
  }

  get vocab() {
    return this.documentContext['vocab'];
  }

  /**
   * this is a workaround because emberjs does not allow us to assign the prefix attribute in the template
   * see https://github.com/emberjs/ember.js/issues/19369
   */
  @action
  setPrefix(element) {
    element.setAttribute(
      'prefix',
      this.prefixToAttrString(this.documentContext.prefix)
    );
    this.ready = true;
  }

  @action
  rdfaEditorInit(editor) {
    if (this.features.isEnabled('prosemirror-dev-tools')) {
      applyDevTools(editor.mainEditorView);
    }
    if (this.args.rdfaEditorInit) {
      this.args.rdfaEditorInit(editor);
    }
    this.controller = editor;
  }

  prefixToAttrString(prefix) {
    let attrString = '';
    Object.keys(prefix).forEach((key) => {
      let uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  }
}
