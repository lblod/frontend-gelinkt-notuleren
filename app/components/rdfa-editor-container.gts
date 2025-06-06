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

import NodeControlsCard from '@lblod/ember-rdfa-editor/components/_private/node-controls/card';
import DocImportedResourceEditorCard from '@lblod/ember-rdfa-editor/components/_private/doc-imported-resource-editor/card';
import ImportedResourceLinkerCard from '@lblod/ember-rdfa-editor/components/_private/imported-resource-linker/card';
import ExternalTripleEditorCard from '@lblod/ember-rdfa-editor/components/_private/external-triple-editor/card';
import RelationshipEditorCard from '@lblod/ember-rdfa-editor/components/_private/relationship-editor/card';
import {
  combineConfigs,
  documentConfig,
  lovConfig,
} from '@lblod/ember-rdfa-editor/components/_private/relationship-editor/configs';
import AttributeEditor from '@lblod/ember-rdfa-editor/components/_private/attribute-editor';
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
import HtmlEditorMenu from '@lblod/ember-rdfa-editor/components/plugins/html-editor/menu';
import ToolbarDropdown from '@lblod/ember-rdfa-editor/components/toolbar/dropdown';
import FormatTextIcon from '@lblod/ember-rdfa-editor/components/icons/format-text';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { ThreeDotsIcon } from '@appuniversum/ember-appuniversum/components/icons/three-dots';
import FormattingToggle from '@lblod/ember-rdfa-editor/components/plugins/formatting/formatting-toggle';
import { restartableTask, timeout } from 'ember-concurrency';
import type {
  OptionGeneratorConfig,
  PredicateOptionGeneratorArgs,
  TargetOptionGeneratorArgs,
} from '@lblod/ember-rdfa-editor/components/_private/relationship-editor/types';

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

  NodeControlsCard = NodeControlsCard;
  DocImportedResourceEditorCard = DocImportedResourceEditorCard;
  ImportedResourceLinkerCard = ImportedResourceLinkerCard;
  ExternalTripleEditorCard = ExternalTripleEditorCard;
  RelationshipEditorCard = RelationshipEditorCard;
  AttributeEditor = AttributeEditor;
  DebugInfo = DebugInfo;
  FormatTextIcon = FormatTextIcon;
  PlusIcon = PlusIcon;
  ThreeDotsIcon = ThreeDotsIcon;

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

  get optionGeneratorConfig(): OptionGeneratorConfig | undefined {
    if (this.controller) {
      return combineConfigs(documentConfig(this.controller), lovConfig());
    }
  }

  subjectOptionGeneratorTask = restartableTask(
    async (args?: TargetOptionGeneratorArgs) => {
      await timeout(200);
      const result = (await this.optionGeneratorConfig?.subjects?.(args)) ?? [];
      return result;
    },
  );
  predicateOptionGeneratorTask = restartableTask(
    async (args?: PredicateOptionGeneratorArgs) => {
      await timeout(200);
      const result =
        (await this.optionGeneratorConfig?.predicates?.(args)) ?? [];
      return result;
    },
  );
  objectOptionGeneratorTask = restartableTask(
    async (args?: TargetOptionGeneratorArgs) => {
      await timeout(200);
      const result = (await this.optionGeneratorConfig?.objects?.(args)) ?? [];
      return result;
    },
  );

  optionGeneratorConfigTaskified: OptionGeneratorConfig = {
    subjects: this.subjectOptionGeneratorTask.perform.bind(this),
    predicates: this.predicateOptionGeneratorTask.perform.bind(this),
    objects: this.objectOptionGeneratorTask.perform.bind(this),
  };

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
                      <ToolbarDropdown
                        @icon={{this.FormatTextIcon}}
                        @direction='horizontal'
                        @title={{t 'rdfa-editor-container.toolbar.format-text'}}
                        as |Menu|
                      >
                        <ToolbarStyling
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                        <TextStyleSuperscript
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                        <TextStyleSubscript
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                        <HeadingMenu
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                      </ToolbarDropdown>
                      <TextStyleColor
                        @controller={{this.controller}}
                        @defaultColor='#000000'
                      />
                      <TextStyleHighlight
                        @controller={{this.controller}}
                        @defaultColor='#FFEA00'
                      />
                    </Tb.Group>
                    <Tb.Group>
                      <TableMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <ToolbarList @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <AlignmentMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <IndentationMenu @controller={{this.controller}} />
                    </Tb.Group>
                    <Tb.Group>
                      <ToolbarDropdown
                        @icon={{this.PlusIcon}}
                        @direction='horizontal'
                        @title={{t 'rdfa-editor-container.toolbar.insert'}}
                        as |Menu|
                      >
                        <LinkMenu
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                        <ImageInsertMenu
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                      </ToolbarDropdown>
                    </Tb.Group>
                  </:main>
                  <:side as |Tb|>
                    {{yield to='toolbar'}}
                    <Tb.Group>
                      <ToolbarDropdown
                        @icon={{this.ThreeDotsIcon}}
                        @direction='horizontal'
                        @title={{t 'rdfa-editor-container.toolbar.more'}}
                        as |Menu|
                      >
                        <HtmlEditorMenu
                          @controller={{this.controller}}
                          @onActivate={{Menu.closeDropdown}}
                        />
                        <FormattingToggle @controller={{this.controller}} />
                      </ToolbarDropdown>

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
                    <div
                      class='au-u-flex au-u-flex--column au-u-flex--spaced-tiny'
                    >
                      {{#if this.activeNode}}
                        <NodeControlsCard
                          @node={{this.activeNode}}
                          @controller={{this.controller}}
                        />
                        <RelationshipEditorCard
                          @node={{this.activeNode}}
                          @controller={{this.controller}}
                          @optionGeneratorConfig={{this.optionGeneratorConfigTaskified}}
                        />
                        <DocImportedResourceEditorCard
                          @controller={{this.controller}}
                          @optionGeneratorConfig={{this.optionGeneratorConfigTaskified}}
                        />
                        <ImportedResourceLinkerCard
                          @node={{this.activeNode}}
                          @controller={{this.controller}}
                        />
                        <ExternalTripleEditorCard
                          @node={{this.activeNode}}
                          @controller={{this.controller}}
                        />
                        <DebugInfo @node={{this.activeNode}} />
                        <AttributeEditor
                          @node={{this.activeNode}}
                          @controller={{this.controller}}
                        />
                      {{/if}}
                    </div>
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
