import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import applyDevTools from 'prosemirror-dev-tools';
import { modifier } from 'ember-modifier';
import { firefoxCursorFix } from '@lblod/ember-rdfa-editor/plugins/firefox-cursor-fix';
import { lastKeyPressedPlugin } from '@lblod/ember-rdfa-editor/plugins/last-key-pressed';
import recreateUuidsOnPaste from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/recreateUuidsOnPaste';
import { chromeHacksPlugin } from '@lblod/ember-rdfa-editor/plugins/chrome-hacks-plugin';
import {
  editableNodePlugin,
  getActiveEditableNode,
} from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';
import AttributeEditor from '@lblod/ember-rdfa-editor/components/_private/attribute-editor';
import RdfaEditor from '@lblod/ember-rdfa-editor/components/_private/rdfa-editor';
import DebugInfo from '@lblod/ember-rdfa-editor/components/_private/debug-info';

/**
 * `shouldShowRdfa` - boolean that indicates whether the editor should be in "RDFA aware" mode, or in old RDFA display mode.
 *                    `true` - RDFA aware mode, `false | undefined` - old RDFA display mode
 * `shouldEditRdfa` - boolean that indicates whether the "RDFA aware" debug tools will be available
 */
export default class RdfaEditorContainerComponent extends Component {
  @service features;
  @tracked controller;
  @tracked ready = false;
  AttributeEditor = AttributeEditor;
  RdfaEditor = RdfaEditor;
  DebugInfo = DebugInfo;

  /**
   * this is a workaround because emberjs does not allow us to assign the prefix attribute in the template
   * see https://github.com/emberjs/ember.js/issues/19369
   */
  setUpPrefixAttr = modifier((element) => {
    element.setAttribute(
      'prefix',
      this.prefixToAttrString(this.documentContext.prefix),
    );
    this.ready = true;
    return () => {
      this.ready = false;
    };
  });

  get plugins() {
    const plugins = this.args.plugins || [];
    return plugins
      .concat(
        firefoxCursorFix(),
        lastKeyPressedPlugin,
        chromeHacksPlugin(),
        (this.args.shouldEditRdfa || this.args.shouldShowRdfa) &&
          editableNodePlugin(),
        recreateUuidsOnPaste,
      )
      .filter((nullCheck) => nullCheck);
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

  get documentContext() {
    if (this.args.editorDocument) {
      try {
        return JSON.parse(this.args.editorDocument.context);
      } catch (e) {
        console.warn(
          'Error encountered during parsing of document context. ' +
            'Reverting to default context.',
          e,
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

  get activeNode() {
    if (
      this.controller &&
      (this.args.shouldEditRdfa || this.args.shouldShowRdfa)
    ) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
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
