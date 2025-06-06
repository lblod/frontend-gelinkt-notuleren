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
import EditorContainer from '@lblod/ember-rdfa-editor/components/editor-container';
import Editor from '@lblod/ember-rdfa-editor/components/editor';
import Sidebar from '@lblod/ember-rdfa-editor/components/sidebar';
import ResponsiveToolbar from '@lblod/ember-rdfa-editor/components/responsive-toolbar';
import AttributeEditor from '@lblod/ember-rdfa-editor/components/_private/attribute-editor';
import RdfaEditor from '@lblod/ember-rdfa-editor/components/_private/rdfa-editor';
import DebugInfo from '@lblod/ember-rdfa-editor/components/_private/debug-info';
import type {
  NodeViewConstructor,
  Plugin,
  SayController,
  Schema,
} from '@lblod/ember-rdfa-editor';
import TextStyleSubscript from '@lblod/ember-rdfa-editor/components/plugins/text-style/subscript';
import TextStyleSuperscript from '@lblod/ember-rdfa-editor/components/plugins/text-style/superscript';
import TextStyleHighlight from '@lblod/ember-rdfa-editor/components/plugins/text-style/highlight';
import TextStyleColor from '@lblod/ember-rdfa-editor/components/plugins/text-style/color';
import IndentationMenu from '@lblod/ember-rdfa-editor/components/plugins/indentation/indentation-menu';
import LinkMenu from '@lblod/ember-rdfa-editor/components/plugins/link/link-menu';
import ImageInsertMenu from '@lblod/ember-rdfa-editor/components/plugins/image/insert-menu';
import TableMenu from '@lblod/ember-rdfa-editor/components/plugins/table/table-menu';
import HeadingMenu from '@lblod/ember-rdfa-editor/components/plugins/heading/heading-menu';
import AlignmentMenu from '@lblod/ember-rdfa-editor/components/plugins/alignment/alignment-menu';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type { Context } from 'frontend-gelinkt-notuleren/config/editor-document-default-context';
// @ts-expect-error no types yet
import ToolbarList from 'frontend-gelinkt-notuleren/components/toolbar/list';
// @ts-expect-error no types yet
import ToolbarStyling from 'frontend-gelinkt-notuleren/components/toolbar/styling';
// @ts-expect-error no types yet
import ToolbarHistory from 'frontend-gelinkt-notuleren/components/toolbar/history';
import AuBodyContainer from '@appuniversum/ember-appuniversum/components/au-body-container';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import t from 'ember-intl/helpers/t';
import { htmlSafe } from '@ember/template';
import { hash } from '@ember/helper';

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
    property?: string;
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

  <template>
    {{#if @busy}}
      <AuBodyContainer>
        <div class='au-c-rdfa-editor'>
          <div class='say-container say-container--sidebar-left'>
            <div class='say-container__main'>
              <div class='say-editor'>
                <div class='say-editor__paper'>
                  <div class='au-c-scanner'>
                    <div class='au-c-scanner__text'>
                      <AuLoader>{{if
                          @busyText
                          @busyText
                          (t 'rdfa-editor-container.default-busy-text')
                        }}
                      </AuLoader>
                    </div>
                    <span class='au-c-scanner__bar'></span>
                  </div>
                  <div class='say-editor__inner say-content'>
                    {{#if this.controller}}
                      {{htmlSafe this.controller.htmlContent}}
                    {{/if}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AuBodyContainer>
    {{else}}
      <AuBodyContainer
        vocab='{{this.vocab}}'
        {{this.setUpPrefixAttr}}
        typeof='{{@typeOfWrappingDiv}}'
        property='{{@property}}'
        resource='#'
      >
        {{#if this.ready}}
          <EditorContainer
            @editorOptions={{hash showPaper=true showToolbarBottom=false}}
          >
            <:top>
              {{#if this.controller}}
                <ResponsiveToolbar>
                  <:main as |Tb|>
                    <Tb.Group>
                      <ToolbarHistory @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <ToolbarStyling @controller={{this.controller}} />
                      {{! @glint-expect-error no arg types }}
                      <TextStyleSubscript @controller={{this.controller}} />
                      {{! @glint-expect-error no arg types }}
                      <TextStyleSuperscript @controller={{this.controller}} />
                      <TextStyleHighlight
                        @controller={{this.controller}}
                        @defaultColor='#FFEA00'
                      />
                      <TextStyleColor
                        @controller={{this.controller}}
                        @defaultColor='#000000'
                      />
                    </Tb.Group>
                    <Tb.Group>
                      <ToolbarList @controller={{this.controller}} />
                      <IndentationMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <LinkMenu @controller={{this.controller}} />
                      <ImageInsertMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <TableMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <HeadingMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <AlignmentMenu @controller={{this.controller}} />
                    </Tb.Group>
                    {{! @glint-expect-error insufficient types for ResponsiveToolbar }}
                    <Tb.Spacer />
                  </:main>
                  <:side as |Tb|>
                    <Tb.Group>
                      {{yield to='toolbar'}}
                    </Tb.Group>
                  </:side>
                </ResponsiveToolbar>
              {{/if}}
            </:top>
            <:default>
              <Editor
                @plugins={{this.plugins}}
                @schema={{this.schema}}
                @nodeViews={{this.nodeViews}}
                @rdfaEditorInit={{this.rdfaEditorInit}}
              />
            </:default>
            <:aside>
              {{#if this.controller}}
                <Sidebar as |Sidebar|>
                  {{#if (has-block 'sidebarCollapsible')}}
                    <Sidebar.Collapsible
                      @title={{t 'utils.insert'}}
                      @expanded={{true}}
                    >
                      {{yield to='sidebarCollapsible'}}
                    </Sidebar.Collapsible>
                  {{/if}}
                  {{yield to='sidebar'}}
                  {{#if @shouldEditRdfa}}
                    {{#if this.activeNode}}
                      <this.RdfaEditor
                        @node={{this.activeNode}}
                        @controller={{this.controller}}
                      />
                      <this.AttributeEditor
                        @node={{this.activeNode}}
                        @controller={{this.controller}}
                      />
                      <this.DebugInfo @node={{this.activeNode}} />
                    {{/if}}
                  {{/if}}
                </Sidebar>
              {{/if}}
            </:aside>
          </EditorContainer>
        {{/if}}
      </AuBodyContainer>
    {{/if}}
  </template>
}
