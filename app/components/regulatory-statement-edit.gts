import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { getOwner } from '@ember/owner';
import type IntlService from 'ember-intl/services/intl';
import t from 'ember-intl/helpers/t';
import perform from 'ember-concurrency/helpers/perform';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
// eslint-disable-next-line ember/no-at-ember-render-modifiers
import didInsert from '@ember/render-modifiers/modifiers/did-insert';
import { array } from '@ember/helper';
import { get } from '@ember/helper';
import { on } from '@ember/modifier';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import AuDropdown from '@appuniversum/ember-appuniversum/components/au-dropdown';
import AuHr from '@appuniversum/ember-appuniversum/components/au-hr';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuBodyContainer from '@appuniversum/ember-appuniversum/components/au-body-container';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';

import {
  em,
  strikethrough,
  strong,
  subscript,
  superscript,
  underline,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import {
  blockRdfaWithConfig,
  docWithConfig,
  hard_break,
  horizontal_rule,
  paragraph,
  repairedBlockWithConfig,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import {
  inlineRdfaWithConfigView,
  inlineRdfaWithConfig,
} from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';
import {
  tableKeymap,
  tableNodes,
  tablePlugins,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  link,
  linkView,
  linkPasteHandler,
} from '@lblod/ember-rdfa-editor/plugins/link';
import { BlockRDFaView } from '@lblod/ember-rdfa-editor/nodes/block-rdfa';
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
import { image, imageView } from '@lblod/ember-rdfa-editor/plugins/image';
import {
  SayController,
  Schema,
  type NodeViewConstructor,
} from '@lblod/ember-rdfa-editor';
import {
  createInvisiblesPlugin,
  hardBreak,
  heading as headingInvisible,
  paragraph as paragraphInvisible,
} from '@lblod/ember-rdfa-editor/plugins/invisibles';
import { emberApplication } from '@lblod/ember-rdfa-editor/plugins/ember-application';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';
import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';
import type { Option } from '@lblod/ember-rdfa-editor/utils/_private/option';
import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import {
  codelist,
  codelistView,
  date,
  dateView,
  number,
  numberView,
  location,
  locationView,
  text_variable,
  textVariableView,
  person_variable,
  personVariableView,
  autofilled_variable,
  autofilledVariableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';
import {
  osloLocation,
  osloLocationView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/location-plugin/node';
import {
  citationPlugin,
  type CitationPluginEmberComponentConfig,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import {
  tableOfContentsView,
  table_of_contents,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/table-of-contents-plugin/nodes';
import { document_title } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/document-title-plugin/nodes';
import {
  snippetPlaceholder,
  snippetPlaceholderView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet-placeholder';
import {
  snippet,
  snippetView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet';
import SnippetInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import { variableAutofillerPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/plugins/autofiller';
import { SAY } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import {
  structureViewWithConfig,
  structureWithConfig,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/structure-plugin/node';
import StructureControlCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/control-card';
import type { StructurePluginOptions } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/structure-plugin/structure-types';
import ToolbarButton from '@lblod/ember-rdfa-editor-lblod-plugins/components/table-of-contents-plugin/toolbar-button';
import ArticleStructureCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/article-structure-plugin/article-structure-card';
import CitationInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/citation-plugin/citation-insert';
import CitationCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/citation-plugin/citation-card';
import DateInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/date/insert';
import DateEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/date/edit';
import CodelistEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/codelist/edit';
import LocationEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/location/edit';
import PersonEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/variable-plugin/person/edit';
import StandardTemplateCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/standard-template-plugin/card';
import TemplateCommentInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/template-comments-plugin/insert';
import TemplateCommentEdit from '@lblod/ember-rdfa-editor-lblod-plugins/components/template-comments-plugin/edit-card';
import LocationInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/location-plugin/insert';
import WorshipInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/worship-plugin/insert';
import LmbInsert from '@lblod/ember-rdfa-editor-lblod-plugins/components/lmb-plugin/insert';
import type StandardTemplate from '@lblod/ember-rdfa-editor-lblod-plugins/models/template';
import type { WorshipPluginConfig } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/worship-plugin';

import ENV from 'frontend-gelinkt-notuleren/config/environment';
import {
  GEMEENTE,
  OCMW,
} from 'frontend-gelinkt-notuleren/utils/bestuurseenheid-classificatie-codes';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import AppChrome from 'frontend-gelinkt-notuleren/components/app-chrome';
import DownloadDocument from 'frontend-gelinkt-notuleren/components/download-document';
import RdfaEditorContainer from 'frontend-gelinkt-notuleren/components/rdfa-editor-container';
import ConfirmRouteLeave from 'frontend-gelinkt-notuleren/components/confirm-route-leave';
import humanFriendlyDate from 'frontend-gelinkt-notuleren/helpers/human-friendly-date';

interface RegulatoryStatementEditSig {
  Args: {
    meetingId: string;
    documentContainer: DocumentContainerModel;
    editorDocument: EditorDocumentModel;
    standardTemplates: StandardTemplate[];
  };
}

export default class RegulatoryStatementEdit extends Component<RegulatoryStatementEditSig> {
  @service declare documentService: DocumentService;
  @service declare store: Store;
  @service declare currentSession: CurrentSessionService;
  @service declare intl: IntlService;

  @tracked controller?: SayController;
  @tracked _editorDocument?: EditorDocumentModel;
  @tracked revisions?: EditorDocumentModel[];
  @tracked citationPlugin = citationPlugin(this.config.citation);

  schema = new Schema({
    nodes: {
      doc: docWithConfig({
        content: 'table_of_contents? document_title? block+',
        rdfaAware: true,
      }),
      paragraph,
      document_title,
      // @ts-expect-error element can be undefined but types say it cannot...
      table_of_contents: table_of_contents(this.config.tableOfContents),
      repaired_block: repairedBlockWithConfig({ rdfaAware: true }),
      list_item: listItemWithConfig({ enableHierarchicalList: true }),
      ordered_list: orderedListWithConfig({ enableHierarchicalList: true }),
      bullet_list: bulletListWithConfig({ enableHierarchicalList: true }),
      placeholder,
      templateComment,
      ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
      date: date(this.config.date),
      codelist,
      location,
      oslo_location: osloLocation(this.config.location),
      number,
      text_variable,
      structure: structureWithConfig(this.config.structures),
      heading: headingWithConfig({ rdfaAware: false }),
      blockquote,
      snippet_placeholder: snippetPlaceholder(this.config.snippet),
      snippet: snippet(this.config.snippet),
      horizontal_rule,
      code_block,
      text,
      image,
      hard_break,
      block_rdfa: blockRdfaWithConfig({ rdfaAware: true }),
      inline_rdfa: inlineRdfaWithConfig({ rdfaAware: true }),
      link: link(this.config.link),
      person_variable,
      autofilled_variable,
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

  get nodeViews() {
    return (controller: SayController) => {
      return {
        // @ts-expect-error element can be undefined but types say it cannot...
        table_of_contents: tableOfContentsView(this.config.tableOfContents)(
          controller,
        ),
        link: linkView(this.config.link)(controller),
        image: imageView(controller),
        oslo_location: osloLocationView(this.config.location)(controller),
        date: dateView(this.config.date)(controller),
        number: numberView(controller),
        location: locationView(controller),
        codelist: codelistView(controller),
        text_variable: textVariableView(controller),
        templateComment: templateCommentView(controller),
        inline_rdfa: inlineRdfaWithConfigView({ rdfaAware: true })(controller),
        block_rdfa: (...args: Parameters<NodeViewConstructor>) =>
          new BlockRDFaView(args, controller),
        snippet_placeholder: snippetPlaceholderView(this.config.snippet)(
          controller,
        ),
        snippet: snippetView(this.config.snippet)(controller),
        person_variable: personVariableView(controller),
        autofilled_variable: autofilledVariableView(controller),
        structure: structureViewWithConfig(this.config.structures)(controller),
      } as unknown as Record<string, NodeViewConstructor>;
    };
  }

  get plugins() {
    return [
      ...tablePlugins,
      tableKeymap,
      this.citationPlugin,
      createInvisiblesPlugin(
        [hardBreak, paragraphInvisible, headingInvisible],
        {
          shouldShowInvisibles: false,
        },
      ),
      linkPasteHandler(this.schema.nodes.link),
      // @ts-expect-error emberApplication should accept undefined as getOwner may return it
      emberApplication({ application: getOwner(this) }),
      listTrackingPlugin(),
      variableAutofillerPlugin(this.config.autofilledVariable),
    ];
  }

  get activeNode() {
    if (this.controller) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
  }

  get config() {
    const municipality = this.defaultMunicipality;
    return {
      tableOfContents: {
        scrollContainer: () =>
          document.getElementsByClassName('say-container__main')[0],
      },
      date: {
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
      citation: {
        activeInNode(node, state) {
          return node.type === state?.schema.nodes['doc'];
        },
        endpoint: '/codex/sparql',
        decisionsEndpoint: ENV.publicatieEndpoint,
        defaultDecisionsGovernmentName: municipality?.naam ?? undefined,
      } satisfies CitationPluginEmberComponentConfig,
      link: {
        interactive: true,
        rdfaAware: true,
      },
      structures: {
        uriGenerator: 'uuid4',
        fullLengthArticles: true,
        onlyArticleSpecialName: false,
      } satisfies StructurePluginOptions,
      worship: {
        endpoint: 'https://data.lblod.info/sparql',
        defaultAdministrativeUnit: municipality?.uri
          ? {
              label: municipality.naam ?? '',
              uri: municipality.uri,
            }
          : undefined,
      } satisfies WorshipPluginConfig,
      snippet: {
        endpoint: ENV.regulatoryStatementEndpoint,
      },
      location: {
        defaultPointUriRoot:
          'https://publicatie.gelinkt-notuleren.vlaanderen.be/id/geometrie/',
        defaultPlaceUriRoot:
          'https://publicatie.gelinkt-notuleren.vlaanderen.be/id/plaats/',
        defaultAddressUriRoot:
          'https://publicatie.gelinkt-notuleren.vlaanderen.be/id/adres/',
        subjectTypesToLinkTo: [
          SAY('Article'),
          SAY('Subsection'),
          SAY('Section'),
          SAY('Chapter'),
        ],
      },
      lmb: {
        endpoint: '/raw-sparql',
      },
      autofilledVariable: {
        autofilledValues: {
          administrativeUnit: `${this.currentSession.classificatie?.label} ${this.currentSession.group?.naam}`,
        },
      },
    };
  }

  fetchRevisions = task(async () => {
    if (this.editorDocument.id && this.documentContainer.id) {
      const revisionsToSkip = [this.editorDocument.id];
      this.revisions = await this.documentService.fetchRevisions.perform(
        this.documentContainer.id,
        revisionsToSkip,
        5,
        0,
      );
    }
  });

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.controller?.checkCommand(undo, {
      view: this.controller?.mainEditorView,
    });
  }

  get editorDocument() {
    return this._editorDocument || this.args.editorDocument;
  }

  get documentContainer() {
    return this.args.documentContainer;
  }

  get codelistEditOptions() {
    return {
      endpoint: ENV.fallbackCodelistEndpoint,
    };
  }

  get locationEditOptions() {
    return {
      endpoint: ENV.fallbackCodelistEndpoint,
      zonalLocationCodelistUri: ENV.zonalLocationCodelistUri,
      nonZonalLocationCodelistUri: ENV.nonZonalLocationCodelistUri,
    };
  }

  get defaultMunicipality(): Option<BestuurseenheidModel> {
    const classificatie = this.currentSession.classificatie;

    if (classificatie?.uri === GEMEENTE || classificatie?.uri === OCMW) {
      return this.currentSession.group;
    }
  }

  saveTask = task(async () => {
    if (this.editorDocument.title) {
      const html = this.controller?.htmlContent;
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          html,
          this.documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;

      const documentContainer = this.documentContainer;
      documentContainer.set('currentVersion', editorDocument);
      await documentContainer.save();
      return this.fetchRevisions.perform();
    }
  });

  onTitleUpdate = task(async (title: string) => {
    const html = this.editorDocument.content;
    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html ?? undefined,
        this.documentContainer,
        this.editorDocument,
      );
    this._editorDocument = editorDocument;
  });

  @action
  handleRdfaEditorInit(controller: SayController) {
    controller.initialize(this.editorDocument.content ?? '', {
      doNotClean: true,
    });
    this.controller = controller;
  }

  <template>
    <AppChrome
      @editorDocument={{this.editorDocument}}
      @documentContainer={{this.documentContainer}}
      @onTitleUpdate={{perform this.onTitleUpdate}}
      @allowTitleUpdate={{true}}
      @isRegulatoryStatement={{true}}
      @dirty={{this.dirty}}
    >
      <:returnLink>
        <AuLink @route='inbox.regulatory-statements' @icon='arrow-left'>
          {{t 'inbox.regulatory-statements.return'}}
        </AuLink>
      </:returnLink>
      <:actionsAfterTitle>
        <AuDropdown @title={{t 'utils.current-version'}} @alignment='left'>
          <p
            class='au-u-padding-small regulatory-statement-current-version-container-active'
          >
            <span class='au-u-medium au-u-margin-right-large'>{{t
                'utils.current-version'
              }}:
            </span>
            <span class='au-u-light'>{{humanFriendlyDate
                this.editorDocument.updatedOn
                locale=this.intl.primaryLocale
              }}</span>
          </p>
          <AuHr />
          <div
            class='au-u-flex--column au-u-flex'
            {{didUpdate (perform this.fetchRevisions)}}
            {{didInsert (perform this.fetchRevisions)}}
          >
            <p
              class='au-u-muted au-u-medium au-u-padding-tiny au-u-padding-left-small'
            >{{t 'utils.history'}}</p>
            {{#each this.revisions as |revision|}}
              {{! template-lint-disable require-context-role }}
              <AuLink
                @route='regulatory-statements.revisions'
                @skin='secondary'
                class='au-u-padding-tiny au-u-padding-left-small'
                role='menuitem'
                @models={{array this.documentContainer.id revision.id}}
              >
                {{humanFriendlyDate
                  revision.updatedOn
                  locale=this.intl.primaryLocale
                }}
                {{#if (get revision.status 'label')}}
                  <AuPill @skin='success'>{{get
                      revision.status
                      'label'
                    }}</AuPill>
                {{/if}}
              </AuLink>
            {{/each}}
            <AuLink
              @route='regulatory-statements.edit.history'
              @model={{this.documentContainer.id}}
              @skin='primary'
              @icon='clock'
              class='au-u-padding-tiny au-u-padding-left-small'
              role='menuitem'
            >
              {{t 'utils.full-history'}}
            </AuLink>
          </div>
        </AuDropdown>
      </:actionsAfterTitle>
      <:actions>
        <AuDropdown @title={{t 'utils.file-options'}} @alignment='right'>
          <DownloadDocument
            @content={{this.controller.htmlContent}}
            @document={{this.editorDocument}}
          />
          <DownloadDocument
            @content={{this.controller.htmlContent}}
            @document={{this.editorDocument}}
            @forPublish={{true}}
          />
          <AuLink
            @route='regulatory-statements.copy'
            @model={{this.documentContainer.id}}
            role='menuitem'
          >
            <AuIcon @icon='copy' @alignment='left' />
            {{t 'regulatory-statement.copy-parts-link'}}
          </AuLink>
        </AuDropdown>
        <AuButton
          {{on 'click' (perform this.saveTask)}}
          @disabled={{this.saveTask.isRunning}}
        >
          {{t 'utils.save'}}
        </AuButton>
      </:actions>
    </AppChrome>

    <AuBodyContainer
      vocab='http://data.vlaanderen.be/ns/besluit#'
      prefix='eli: http://data.europa.eu/eli/ontology# prov: http://www.w3.org/ns/prov# mandaat: http://data.vlaanderen.be/ns/mandaat# besluit: http://data.vlaanderen.be/ns/besluit# say:https://say.data.gift/ns/ dct: http://purl.org/dc/terms/ ext:http://mu.semte.ch/vocabularies/ext/'
    >
      <RdfaEditorContainer
        @rdfaEditorInit={{this.handleRdfaEditorInit}}
        @typeOfWrappingDiv='lblodgn:ReglementaireBijlage'
        @editorDocument={{this.editorDocument}}
        @busy={{this.saveTask.isRunning}}
        @busyText={{t 'rdfa-editor-container.saving'}}
        @schema={{this.schema}}
        @nodeViews={{this.nodeViews}}
        @plugins={{this.plugins}}
        @shouldEditRdfa={{false}}
      >
        <:toolbar>
          {{#if this.controller}}
            <div class='au-u-margin-right-small'>
              <ToolbarButton @controller={{this.controller}} />
            </div>
          {{/if}}
        </:toolbar>
        <:sidebarCollapsible>
          {{#if this.controller}}
            <ArticleStructureCard
              @controller={{this.controller}}
              @options={{this.config.structures}}
            />
            <CitationInsert
              @controller={{this.controller}}
              @config={{this.config.citation}}
            />
            <DateInsert @controller={{this.controller}} />
            <StandardTemplateCard
              @controller={{this.controller}}
              @templates={{@standardTemplates}}
            />
            <TemplateCommentInsert @controller={{this.controller}} />
            <LocationInsert
              @controller={{this.controller}}
              {{! @glint-expect-error Option vs undefined }}
              @defaultMunicipality={{get this.defaultMunicipality 'naam'}}
              @config={{this.config.location}}
            />
            <WorshipInsert
              @controller={{this.controller}}
              @config={{this.config.worship}}
            />
            <LmbInsert
              @controller={{this.controller}}
              @config={{this.config.lmb}}
            />

            {{#if this.activeNode}}
              <SnippetInsert
                @controller={{this.controller}}
                @config={{this.config.snippet}}
                @node={{this.activeNode}}
              />
            {{/if}}
          {{/if}}
        </:sidebarCollapsible>
        <:sidebar>
          {{#if this.controller}}
            <StructureControlCard @controller={{this.controller}} />
            <CitationCard
              @controller={{this.controller}}
              @config={{this.config.citation}}
            />
            <DateEdit
              @controller={{this.controller}}
              @options={{this.config.date}}
            />
            <CodelistEdit
              @controller={{this.controller}}
              @options={{this.codelistEditOptions}}
            />
            <LocationEdit
              @controller={{this.controller}}
              @options={{this.locationEditOptions}}
            />
            <PersonEdit
              @controller={{this.controller}}
              @config={{this.config.lmb}}
            />
            <TemplateCommentEdit @controller={{this.controller}} />
          {{/if}}
        </:sidebar>
      </RdfaEditorContainer>
    </AuBodyContainer>
    <ConfirmRouteLeave
      @enabled={{this.dirty}}
      @message={{t 'behandeling-van-agendapunten.confirm-leave-without-saving'}}
    />
  </template>
}
