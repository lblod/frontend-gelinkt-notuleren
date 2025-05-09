import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { getOwner } from '@ember/application';
import { insertHtml } from '@lblod/ember-rdfa-editor/commands/insert-html-command';
import instantiateUuids from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/standard-template-plugin/utils/instantiate-uuids';

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
import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
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
import { Schema } from '@lblod/ember-rdfa-editor';
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
import { citationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
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
import SnippetInsertRdfaComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import { variableAutofillerPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/plugins/autofiller';
import { SAY } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import {
  structureViewWithConfig,
  structureWithConfig,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/structure-plugin/node';
import StructureControlCardComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/control-card';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import {
  GEMEENTE,
  OCMW,
} from '../../utils/bestuurseenheid-classificatie-codes';

import VisualiserCard from '@lblod/ember-rdfa-editor/components/_private/rdfa-visualiser/visualiser-card';
import LinkRdfaNodeButton from '@lblod/ember-rdfa-editor/components/_private/link-rdfa-node-poc/button';
import { RDFA_VISUALIZER_CONFIG } from 'frontend-gelinkt-notuleren/utils/citerra-poc/visualizer';
import { BACKLINK_EDITOR_CONFIG } from 'frontend-gelinkt-notuleren/utils/citerra-poc/backlink-editor';

export default class RegulatoryStatementsRoute extends Controller {
  @service documentService;
  @service store;
  @service currentSession;
  @tracked controller;
  @tracked _editorDocument;
  @tracked revisions;
  @service intl;
  editor;
  @tracked citationPlugin = citationPlugin(this.config.citation);
  SnippetInsert = SnippetInsertRdfaComponent;
  StructureControlCard = StructureControlCardComponent;

  schema = new Schema({
    nodes: {
      doc: docWithConfig({
        content: 'table_of_contents? document_title? block+',
        rdfaAware: true,
      }),
      paragraph,
      document_title,
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
    return (controller) => {
      return {
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
        block_rdfa: (node) => new BlockRDFaView(node),
        snippet_placeholder: snippetPlaceholderView(this.config.snippet)(
          controller,
        ),
        snippet: snippetView(this.config.snippet)(controller),
        person_variable: personVariableView(controller),
        autofilled_variable: autofilledVariableView(controller),
        structure: structureViewWithConfig(this.config.structures)(controller),
      };
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
        type: 'nodes',
        activeInNode(node, state) {
          return node.type === state.schema.nodes.doc;
        },
        endpoint: '/codex/sparql',
        decisionsEndpoint: ENV.publicatieEndpoint,
        defaultDecisionsGovernmentName: municipality.naam,
      },
      link: {
        interactive: true,
        rdfaAware: true,
      },
      structures: {
        uriGenerator: 'uuid4',
        fullLengthArticles: true,
        onlyArticleSpecialName: false,
      },
      worship: {
        endpoint: 'https://data.lblod.info/sparql',
        defaultAdministrativeUnit: municipality.uri && {
          label: municipality.naam,
          uri: municipality.uri,
        },
      },
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
    const revisionsToSkip = [this.editorDocument.id];
    this.revisions = await this.documentService.fetchRevisions.perform(
      this.documentContainer.id,
      revisionsToSkip,
      5,
    );
  });

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.controller?.checkCommand(undo, {
      view: this.controller?.mainEditorView,
    });
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
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

  get defaultMunicipality() {
    const classificatie = this.currentSession.classificatie;

    if (classificatie?.uri === GEMEENTE || classificatie?.uri === OCMW) {
      return this.currentSession.group;
    } else {
      // Return empty object instead of null so can be used safely in template
      return {};
    }
  }

  saveTask = task(async () => {
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.controller.htmlContent;
      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          html,
          this.documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;

      const documentContainer = this.documentContainer;
      documentContainer.currentVersion = editorDocument;
      await documentContainer.save();
      this.fetchRevisions.perform();
    }
  });

  onTitleUpdate = task(async (title) => {
    const html = this.editorDocument.content;
    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument,
      );
    this._editorDocument = editorDocument;
  });

  @action
  handleRdfaEditorInit(controller) {
    controller.initialize(this.editorDocument.content, { doNotClean: true });
    this.controller = controller;
  }

  /**
   * CITERRA POC
   */
  VisualiserCard = VisualiserCard;
  LinkRdfaNodeButton = LinkRdfaNodeButton;
  visualizerConfig = RDFA_VISUALIZER_CONFIG;
  backlinkEditorConfig = BACKLINK_EDITOR_CONFIG;

  @action
  insertThing(thing) {
    const map = {
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
    this.controller.withTransaction((tr) => tr.scrollIntoView(false));
  }
}
