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

import { insertHtml } from '@lblod/ember-rdfa-editor/commands/insert-html-command';
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
  ProsePlugin,
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
import VisualiserCard from '@lblod/ember-rdfa-editor/components/_private/rdfa-visualiser/visualiser-card';
import CreateRelationshipButton from '@lblod/ember-rdfa-editor/components/_private/relationship-editor/create-button';
import type { Option } from '@lblod/ember-rdfa-editor/utils/_private/option';

import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import instantiateUuids from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin/utils/instantiate-uuids';
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
import TableOfContentsButton from '@lblod/ember-rdfa-editor-lblod-plugins/components/table-of-contents-plugin/toolbar-button';
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
import { fn } from '@ember/helper';
import type StandardTemplate from '@lblod/ember-rdfa-editor-lblod-plugins/models/template';
import type { WorshipPluginConfig } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/worship-plugin';
import DocumentValidationPluginCard from '@lblod/ember-rdfa-editor-lblod-plugins/components/document-validation-plugin/card';
import {
  documentValidationPlugin,
  documentValidationPluginKey,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/document-validation-plugin';

import ENV from 'frontend-gelinkt-notuleren/config/environment';
import {
  GEMEENTE,
  OCMW,
} from 'frontend-gelinkt-notuleren/utils/bestuurseenheid-classificatie-codes';
import { RDFA_VISUALIZER_CONFIG } from 'frontend-gelinkt-notuleren/utils/citerra-poc/visualizer';
import { relationshipEditorConfig } from 'frontend-gelinkt-notuleren/utils/citerra-poc/relationship-editor';
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
import { sayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { getShapeOfDocumentType } from '@lblod/lib-decision-shapes';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';

interface RegulatoryStatementEditSig {
  Args: {
    meetingId: string;
    documentContainer: DocumentContainerModel;
    editorDocument: EditorDocumentModel;
    standardTemplates: StandardTemplate[];
  };
}

export default class RegulatoryStatementEditCiterra extends Component<RegulatoryStatementEditSig> {
  @service declare documentService: DocumentService;
  @service declare store: Store;
  @service declare currentSession: CurrentSessionService;
  @service declare intl: IntlService;

  @tracked controller?: SayController;
  @tracked _editorDocument?: EditorDocumentModel;
  @tracked revisions?: EditorDocumentModel[];
  @tracked citationPlugin = citationPlugin(this.config.citation);
  @tracked showMultipleEditWarning = false;
  html?: string;
  title?: string;

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

  get plugins(): ProsePlugin[] {
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
      documentValidationPlugin(this.config.documentValidation),
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
        additionalRDFTypes: [
          sayDataFactory.namedNode(
            'https://data.vlaanderen.be/ns/mobiliteit#Zone',
          ),
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
      documentValidation: {
        documentShape: getShapeOfDocumentType('citerra'),
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

  validationTask = task(async () => {
    if (this.controller) {
      const html = this.controller.htmlContent;
      const pluginState = documentValidationPluginKey.getState(
        this.controller.mainEditorState,
      );
      await pluginState?.validationCallback(
        this.controller.mainEditorView,
        html,
      );
    }
  });
  saveTask = task(async () => {
    if (this.editorDocument.title && this.controller) {
      const html = this.controller.htmlContent;
      await this.documentContainer.currentVersion.reload({});
      const currentVersion = (await this.documentContainer
        .currentVersion) as EditorDocumentModel;
      if (currentVersion.id !== this.editorDocument.id) {
        this.showMultipleEditWarning = true;
        this.html = html;
        this.title = this.editorDocument.title;
      } else {
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
    }
  });

  confirmMultipleEdit = task(async () => {
    if (this.title && this.controller) {
      await this.documentContainer.currentVersion.reload({});
      const currentVersion = (await this.documentContainer
        .currentVersion) as EditorDocumentModel;

      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.title,
          this.html,
          this.documentContainer,
          currentVersion,
        );
      this._editorDocument = editorDocument;

      const documentContainer = this.documentContainer;
      documentContainer.set('currentVersion', editorDocument);
      await documentContainer.save();
      this.showMultipleEditWarning = false;
      return this.fetchRevisions.perform();
    }
  });

  onTitleUpdate = task(async (title: string) => {
    const html = this.editorDocument.content;
    await this.documentContainer.currentVersion.reload({});
    const currentVersion = (await this.documentContainer
      .currentVersion) as EditorDocumentModel;
    if (currentVersion.id !== this.editorDocument.id) {
      this.showMultipleEditWarning = true;
      this.html = html as string;
      this.title = title;
    } else {
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          title,
          html ?? undefined,
          this.documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;
    }
  });

  closeMultipleEditWarning = task(async () => {
    this._editorDocument = (await this.documentContainer
      .currentVersion) as EditorDocumentModel;
    this.showMultipleEditWarning = false;
  });

  @action
  handleRdfaEditorInit(controller: SayController) {
    controller.initialize(this.editorDocument.content ?? '', {
      doNotClean: true,
    });
    this.controller = controller;
    // If we validate on save, the doc is re-initialised and we lose it, so validate on load instead
    this.validationTask.perform().catch((err) => {
      console.error('Error validating document', err);
    });
  }

  /**
   * CITERRA POC
   */
  visualizerConfig = RDFA_VISUALIZER_CONFIG;

  get backlinkEditorConfig() {
    return this.controller && relationshipEditorConfig(this.controller);
  }

  get busy() {
    return this.saveTask.isRunning || this.showMultipleEditWarning;
  }

  @action
  insertThing(thing: string) {
    const map: Record<string, string> = {
      nummerplaten: /* HTML */ `
        <div
          class="say-editable say-block-rdfa"
          about="http://data.vlaanderen.be/id/voorwaarden/--ref-uuid4-b73cdde4-482a-454a-8323-ce20e04e3ac7"
          data-say-id="b73cdde4-482a-454a-8323-ce20e04e3ac7"
          property="http://www.w3.org/ns/prov#value"
          lang="nl-be"
          data-pm-slice="0 0 []"
          ><div
            style="display: none"
            class="say-hidden"
            data-rdfa-container="true"
            ><span
              about="http://data.vlaanderen.be/id/voorwaarden/--ref-uuid4-b73cdde4-482a-454a-8323-ce20e04e3ac7"
              property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
              resource="http://data.europa.eu/m8g/Requirement"
            ></span
            ><span
              property="http://www.w3.org/2004/02/skos/core#prefLabel"
              content="Aantal nummerplaten"
              lang="nl-be"
            ></span></div
          ><div data-content-container="true"
            ><p class="say-paragraph"
              >Tenzij anders bepaald, kan de vergunning voor een onbeperkt
              aantal nummerplaten worden aangevraagd</p
            ></div
          ></div
        >
      `,
      duurtijd: /* HTML */ `
        <div
          class="say-editable say-block-rdfa"
          about="http://data.vlaanderen.be/id/duurtijden/--ref-uuid4-7586b9c7-e0ed-4a9f-94f6-5705420ec3cf"
          data-say-id="7586b9c7-e0ed-4a9f-94f6-5705420ec3cf"
          property="http://www.w3.org/ns/prov#value"
          lang="nl-be"
          data-pm-slice="0 0 []"
          ><div
            style="display: none"
            class="say-hidden"
            data-rdfa-container="true"
            ><span
              about="http://data.vlaanderen.be/id/duurtijden/--ref-uuid4-7586b9c7-e0ed-4a9f-94f6-5705420ec3cf"
              property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
              resource="http://data.europa.eu/m8g/Requirement"
            ></span
            ><span
              property="http://www.w3.org/2004/02/skos/core#prefLabel"
              content="Duurtijd"
              lang="nl-be"
            ></span></div
          ><div data-content-container="true"
            ><p class="say-paragraph"
              >Tenzij anders bepaald, heeft de vergunning een onbeperkte
              duurtijd.</p
            ></div
          ></div
        >
      `,
      zone: /* HTML */ `
        <div
          class="say-editable say-block-rdfa"
          about="http://data.vlaanderen.be/id/zones/--ref-uuid4-32047e20-00d3-4b66-8f1f-9dc5fa275e0f"
          data-say-id="32047e20-00d3-4b66-8f1f-9dc5fa275e0f"
          property="http://www.w3.org/ns/prov#value"
          lang="nl-be"
          data-pm-slice="0 0 []"
          ><div
            style="display: none"
            class="say-hidden"
            data-rdfa-container="true"
            ><span
              property="http://www.w3.org/2004/02/skos/core#prefLabel"
              content="Zone"
              lang="nl-be"
            ></span
            ><span
              about="http://data.vlaanderen.be/id/zones/--ref-uuid4-32047e20-00d3-4b66-8f1f-9dc5fa275e0f"
              property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
              resource="https://data.vlaanderen.be/ns/mobiliteit#Zone"
            ></span
            ><span
              about="http://data.vlaanderen.be/id/zones/--ref-uuid4-32047e20-00d3-4b66-8f1f-9dc5fa275e0f"
              property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
              resource="http://data.europa.eu/m8g/Requirement"
            ></span></div
          ><div data-content-container="true"><p class="say-paragraph"></p></div
        ></div>
      `,
      bewijsstuk: /* HTML */ `
        <span
          class="say-variable"
          data-say-variable="true"
          data-say-variable-type="codelist"
          data-selection-style="single"
          data-label="bewijsstuk"
          data-codelist="http://lblod.data.gift/concept-schemes/6810101828455F96985D7CD2"
          data-source="/raw-sparql"
          data-say-id="5af9422e-2479-4b3b-8ca6-0a30d66cf254"
          data-literal-node="true"
          datatype="http://www.w3.org/2001/XMLSchema#string"
          ><span
            style="display: none"
            class="say-hidden"
            data-rdfa-container="true"
          ></span
          ><span data-content-container="true"
            ><span
              class="mark-highlight-manual say-placeholder"
              placeholdertext="bewijsstuk"
              contenteditable="false"
              >bewijsstuk</span
            ></span
          ></span
        >
      `,
      voorwaarde: /* HTML */ `
        <div
          class="say-editable say-block-rdfa"
          about="http://data.vlaanderen.be/id/voorwaarden/--ref-uuid4-197c3905-3587-4c33-9765-d34ec7e113a1"
          data-say-id="d3ecf4b0-f9b5-4ef8-893e-94784f170a61"
          property="http://www.w3.org/ns/prov#value"
          lang="nl-be"
          data-pm-slice="0 0 []"
          ><div
            style="display: none"
            class="say-hidden"
            data-rdfa-container="true"
            ><span
              about="http://data.vlaanderen.be/id/voorwaarden/--ref-uuid4-197c3905-3587-4c33-9765-d34ec7e113a1"
              property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
              resource="http://data.europa.eu/m8g/Requirement"
            ></span
            ><span
              property="http://www.w3.org/2004/02/skos/core#prefLabel"
              content="Voorwaarde"
              lang="nl-be"
            ></span
            ><span
              rev="http://data.europa.eu/m8g/isRequirementOf"
              resource="http://collection/1"
            ></span></div
          ><div data-content-container="true"><p class="say-paragraph"></p></div
        ></div>
      `,
      doelgroep: /* HTML */ `
        <div>
          <div
            class="say-editable say-block-rdfa"
            about="http://data.vlaanderen.be/7079c444-a934-4ddf-85d1-f0968b5555dd"
            data-say-id="7079c444-a934-4ddf-85d1-f0968b5555dd"
            data-pm-slice="0 0 []"
            ><div
              style="display: none"
              class="say-hidden"
              data-rdfa-container="true"
              ><span
                about="http://data.vlaanderen.be/7079c444-a934-4ddf-85d1-f0968b5555dd"
                property="http://www.w3.org/1999/02/22-rdf-syntax-ns#type"
                resource="http://data.europa.eu/m8g/Requirement"
              ></span
              ><span
                property="http://www.w3.org/2004/02/skos/core#prefLabel"
                content="Doelgroep"
                lang="nl-be"
              ></span></div
            ><div data-content-container="true"
              ><p class="say-paragraph"
                ><span
                  class="say-variable"
                  data-say-variable="true"
                  data-say-variable-type="codelist"
                  data-selection-style="single"
                  data-label="type aanvrager"
                  data-codelist="http://lblod.data.gift/concept-schemes/680FE8AD28455F96985D7CB9"
                  data-source="/raw-sparql"
                  data-say-id="0b1fedba-91c9-4d2d-9720-67bc618e8842"
                  data-literal-node="true"
                  datatype="http://www.w3.org/2001/XMLSchema#string"
                  ><span
                    style="display: none"
                    class="say-hidden"
                    data-rdfa-container="true"
                  ></span
                  ><span data-content-container="true"
                    ><span
                      class="mark-highlight-manual say-placeholder"
                      placeholdertext="type aanvrager"
                      contenteditable="false"
                      >type aanvrager</span
                    ></span
                  ></span
                >
                waarbij volgende voorwaarden van toepassing zijn:</p
              ></div
            ></div
          ></div
        >
      `,
    };
    if (map[thing] && this.controller) {
      this.controller.doCommand(
        insertHtml(
          instantiateUuids(map[thing]),
          this.controller.mainEditorState.selection.from,
          this.controller.mainEditorState.selection.to,
          undefined,
          false,
          true,
        ),
        { view: this.controller.mainEditorView },
      );
      this.controller.withTransaction((tr) => tr.scrollIntoView());
    }
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
        @busy={{this.busy}}
        @busyText={{t 'rdfa-editor-container.saving'}}
        @schema={{this.schema}}
        @nodeViews={{this.nodeViews}}
        @plugins={{this.plugins}}
        @shouldEditRdfa={{false}}
      >
        <:toolbar as |container|>
          <div class='au-u-margin-right-small'>
            <TableOfContentsButton @controller={{container.controller}} />
          </div>
        </:toolbar>
        <:sidebarCollapsible as |container|>
          {{#if this.activeNode}}
            <CreateRelationshipButton
              @controller={{container.controller}}
              @node={{this.activeNode}}
              @optionGeneratorConfig={{this.backlinkEditorConfig}}
            />
          {{/if}}
          <ArticleStructureCard
            @controller={{container.controller}}
            @options={{this.config.structures}}
          />
          <CitationInsert
            @controller={{container.controller}}
            @config={{this.config.citation}}
          />
          <DateInsert @controller={{container.controller}} />
          <StandardTemplateCard
            @controller={{container.controller}}
            @templates={{@standardTemplates}}
          />
          <TemplateCommentInsert @controller={{container.controller}} />
          <LocationInsert
            @controller={{container.controller}}
            {{! @glint-expect-error Option vs undefined }}
            @defaultMunicipality={{get this.defaultMunicipality 'naam'}}
            @config={{this.config.location}}
          />
          <WorshipInsert
            @controller={{container.controller}}
            @config={{this.config.worship}}
          />
          <LmbInsert
            @controller={{container.controller}}
            @config={{this.config.lmb}}
          />

          <AuButton
            @skin='link'
            @icon='add'
            {{on 'click' (fn this.insertThing 'doelgroep')}}
          >{{t 'rdfa-editor-container.citerra.doelgroep'}}</AuButton>
          <AuButton
            @skin='link'
            @icon='add'
            {{on 'click' (fn this.insertThing 'voorwaarde')}}
          >{{t 'rdfa-editor-container.citerra.voorwaarde'}}</AuButton>
          <AuButton
            @skin='link'
            @icon='add'
            {{on 'click' (fn this.insertThing 'bewijsstuk')}}
          >{{t 'rdfa-editor-container.citerra.bewijsstuk'}}</AuButton>
          <AuButton
            @skin='link'
            @icon='add'
            {{on 'click' (fn this.insertThing 'zone')}}
          >{{t 'rdfa-editor-container.citerra.zone'}}</AuButton>
          <AuButton
            @skin='link'
            @icon='add'
            {{on 'click' (fn this.insertThing 'duurtijd')}}
          >{{t 'rdfa-editor-container.citerra.duurtijd'}}</AuButton>
          <AuButton
            @skin='link'
            @icon='add'
            {{on 'click' (fn this.insertThing 'nummerplaten')}}
          >{{t 'rdfa-editor-container.citerra.nummerplaten'}}</AuButton>
          {{#if this.activeNode}}
            <SnippetInsert
              @controller={{container.controller}}
              @config={{this.config.snippet}}
              @node={{this.activeNode}}
            />
          {{/if}}
        </:sidebarCollapsible>
        <:sidebar as |container|>
          <DocumentValidationPluginCard @controller={{container.controller}} />
          {{#if this.activeNode}}
            <VisualiserCard
              @controller={{container.controller}}
              @config={{this.visualizerConfig}}
            />
          {{/if}}
          <StructureControlCard @controller={{container.controller}} />
          <CitationCard
            @controller={{container.controller}}
            @config={{this.config.citation}}
          />
          <DateEdit
            @controller={{container.controller}}
            @options={{this.config.date}}
          />
          <CodelistEdit
            @controller={{container.controller}}
            @options={{this.codelistEditOptions}}
          />
          <LocationEdit
            @controller={{container.controller}}
            @options={{this.locationEditOptions}}
          />
          <PersonEdit
            @controller={{container.controller}}
            @config={{this.config.lmb}}
          />
          <TemplateCommentEdit @controller={{container.controller}} />
        </:sidebar>
      </RdfaEditorContainer>
    </AuBodyContainer>
    <ConfirmRouteLeave
      @enabled={{this.dirty}}
      @message={{t 'behandeling-van-agendapunten.confirm-leave-without-saving'}}
    />
    <AuModal
      @title={{t 'multiple-edit-modal.title'}}
      @modalOpen={{this.showMultipleEditWarning}}
      @closeModal={{perform this.closeMultipleEditWarning}}
      as |Modal|
    >
      <Modal.Body>
        <p>{{t 'multiple-edit-modal.message'}}</p>
      </Modal.Body>
      <Modal.Footer>
        <AuButton {{on 'click' (perform this.confirmMultipleEdit)}}>{{t
            'multiple-edit-modal.confirm'
          }}</AuButton>
        <AuButton
          @skin='secondary'
          {{on 'click' (perform this.closeMultipleEditWarning)}}
        >{{t 'multiple-edit-modal.cancel'}}</AuButton>
      </Modal.Footer>
    </AuModal>
  </template>
}
