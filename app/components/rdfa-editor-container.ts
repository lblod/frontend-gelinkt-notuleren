import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
// @ts-expect-error No types
import applyDevTools from 'prosemirror-dev-tools';
import { modifier } from 'ember-modifier';
import type Features from 'ember-feature-flags';
import { firefoxCursorFix } from '@lblod/ember-rdfa-editor/plugins/firefox-cursor-fix';
import { lastKeyPressedPlugin } from '@lblod/ember-rdfa-editor/plugins/last-key-pressed';
import recreateUuidsOnPaste from '@lblod/ember-rdfa-editor/plugins/recreateUuidsOnPaste';
import { chromeHacksPlugin } from '@lblod/ember-rdfa-editor/plugins/chrome-hacks-plugin';
import {
  editableNodePlugin,
  getActiveEditableNode,
} from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';
import AttributeEditor from '@lblod/ember-rdfa-editor/components/_private/attribute-editor';
import RdfaEditor from '@lblod/ember-rdfa-editor/components/_private/rdfa-editor';
import DebugInfo from '@lblod/ember-rdfa-editor/components/_private/debug-info';
import type {
  NodeViewConstructor,
  Plugin,
  SayController,
  Schema,
} from '@lblod/ember-rdfa-editor';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type { Context } from 'frontend-gelinkt-notuleren/config/editor-document-default-context';

interface Sig {
  Args: {
    editorDocument?: EditorDocumentModel;
    prefix?: Context['prefix'];
    rdfaEditorInit?: (controller: SayController) => void;
    // TODO should this be PluginConfig[]?
    plugins?: Plugin[];
    schema: Schema;
    nodeViews?: (
      controller: SayController,
    ) => Record<string, NodeViewConstructor>;
    typeOfWrappingDiv?: string;
    busy?: boolean;
    busyText?: string;
    shouldEditRdfa?: boolean;
  };
  Blocks: {
    toolbar: [];
    sidebarCollapsible: [];
    sidebar: [];
  };
}

export default class RdfaEditorContainerComponent extends Component<Sig> {
  @service declare features: Features;
  @tracked controller?: SayController;
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

  get plugins(): Plugin[] {
    const plugins = this.args.plugins || [];
    return plugins
      .concat(
        firefoxCursorFix(),
        lastKeyPressedPlugin,
        chromeHacksPlugin(),
        editableNodePlugin(),
        recreateUuidsOnPaste,
      )
      .filter((nullCheck) => nullCheck);
  }

  get schema() {
    return this.args.schema;
  }

  get nodeViews() {
    return this.args.nodeViews;
  }

  get documentContext(): Context {
    if (this.args.editorDocument) {
      try {
        // TODO should validate this
        return JSON.parse(this.args.editorDocument.context ?? '') as Context;
      } catch (e) {
        console.warn(
          'Error encountered during parsing of document context. ' +
            'Reverting to default context.',
          e,
        );
      }
    }
    return {
      prefix: this.args.prefix ?? {},
      typeof: '',
      vocab: '',
    };
  }

  get vocab() {
    return this.documentContext['vocab'];
  }

  get activeNode() {
    if (this.controller) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
  }

  @action
  rdfaEditorInit(editor: SayController) {
    if (this.features.isEnabled('prosemirror-dev-tools')) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      applyDevTools(editor.mainEditorView);
    }
    if (this.args.rdfaEditorInit) {
      this.args.rdfaEditorInit(editor);
    }
    this.controller = editor;
  }

  prefixToAttrString(prefix: Context['prefix']) {
    let attrString = '';
    Object.keys(prefix).forEach((key) => {
      const uri = prefix[key];
      attrString += `${key}: ${uri} `;
    });
    return attrString;
  }
}
