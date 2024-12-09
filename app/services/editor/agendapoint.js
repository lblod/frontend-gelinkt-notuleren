import Service, { service } from '@ember/service';
import { v4 as uuidv4 } from 'uuid';
import { removePropertiesOfDeletedNodes } from '@lblod/ember-rdfa-editor/plugins/remove-properties-of-deleted-nodes';
import { defaultAttributeValueGeneration } from '@lblod/ember-rdfa-editor/plugins/default-attribute-value-generation';
import { rdfaInfoPlugin } from '@lblod/ember-rdfa-editor/plugins/rdfa-info';

import { Schema } from '@lblod/ember-rdfa-editor';
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
  invisibleRdfaWithConfig,
  paragraph,
  repairedBlockWithConfig,
  text,
} from '@lblod/ember-rdfa-editor/nodes';
import {
  tableKeymap,
  tableNodes,
  tablePlugins,
} from '@lblod/ember-rdfa-editor/plugins/table';
import {
  date,
  dateView,
  codelist,
  codelistView,
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
  createInvisiblesPlugin,
  hardBreak,
  heading as headingInvisible,
  paragraph as paragraphInvisible,
} from '@lblod/ember-rdfa-editor/plugins/invisibles';
import {
  templateComment,
  templateCommentView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import { roadsign_regulation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/nodes';
import {
  link,
  linkView,
  linkPasteHandler,
} from '@lblod/ember-rdfa-editor/plugins/link';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';

import ENV from 'frontend-gelinkt-notuleren/config/environment';
import {
  regulatoryStatementNode,
  regulatoryStatementNodeView,
} from '../../editor-plugins/regulatory-statements-plugin';
import {
  GEMEENTE,
  OCMW,
} from '../../utils/bestuurseenheid-classificatie-codes';
import {
  structureWithConfig,
  structureViewWithConfig,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/structure-plugin/node';
import {
  inlineRdfaWithConfig,
  inlineRdfaWithConfigView,
} from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';

import {
  mandatee_table,
  mandateeTableView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/mandatee-table-plugin/node';

import {
  snippetPlaceholder,
  snippetPlaceholderView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet-placeholder';
import {
  snippet,
  snippetView,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet';
import { BlockRDFaView } from '@lblod/ember-rdfa-editor/nodes/block-rdfa';

import { IVGR_TAGS, RMW_TAGS } from '../../config/mandatee-table-config';
import { variableAutofillerPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/plugins/autofiller';
import { emberApplication } from '@lblod/ember-rdfa-editor/plugins/ember-application';
import { getOwner } from '@ember/application';
import { EditorState, ProseParser } from '@lblod/ember-rdfa-editor';
import { htmlToDoc } from '@lblod/ember-rdfa-editor/utils/_private/html-utils';
import { citationPlugin } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/citation-plugin';
import { isRdfaAttrs } from '@lblod/ember-rdfa-editor/core/schema';
import { BESLUIT } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import configurationPerAdminUnit from '../../config/configuration-per-admin-unit';

export default class AgendapointEditorService extends Service {
  @service intl;
  @service currentSession;

  citationPlugin = citationPlugin(this.config.citation);

  get config() {
    const classificatie = this.currentSession.classificatie;
    const municipality = this.defaultMunicipality;
    return {
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
        activeInNode(node) {
          const { attrs } = node;
          if (!isRdfaAttrs(attrs)) {
            return false;
          }
          const match = attrs.backlinks.find((bl) =>
            BESLUIT('motivering').matches(bl.predicate),
          );
          return Boolean(match);
        },
        endpoint: '/codex/sparql',
        decisionsEndpoint: ENV.publicatieEndpoint,
        defaultDecisionsGovernmentName: municipality.naam,
      },
      link: {
        interactive: true,
        rdfaAware: true,
      },
      roadsignRegulation: {
        endpoint: ENV.mowRegistryEndpoint,
        imageBaseUrl: ENV.roadsignImageBaseUrl,
      },
      besluitType: {
        endpoint: 'https://centrale-vindplaats.lblod.info/sparql',
        classificatieUri: classificatie?.uri,
      },
      besluitTopic: {
        endpoint: 'https://data.vlaanderen.be/sparql',
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
      },
      lpdc: {
        endpoint: '/lpdc-service',
      },
      mandateeTable: {
        tags: [...IVGR_TAGS, ...RMW_TAGS],
        defaultTag: IVGR_TAGS[0],
      },
      lmb: {
        endpoint: '/sparql',

        defaultAdminUnit: municipality.naam,
      },
      autofilledVariable: {
        autofilledValues: {
          administrativeUnit: `${municipality.naam}`,
        },
      },
      insertArticle: {
        uriGenerator: () => `http://data.lblod.info/artikels/${uuidv4()}`,
      },
      ...this.adminUnitConfig,
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

  get adminUnitConfig() {
    return configurationPerAdminUnit[this.defaultMunicipality.uri] || {};
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

  get nodeViews() {
    return (controller) => {
      return {
        regulatoryStatementNode: regulatoryStatementNodeView(controller),
        link: linkView(this.config.link)(controller),
        image: imageView(controller),
        oslo_location: osloLocationView(this.config.location)(controller),
        date: dateView(this.config.date)(controller),
        number: numberView(controller),
        text_variable: textVariableView(controller),
        location: locationView(controller),
        codelist: codelistView(controller),
        templateComment: templateCommentView(controller),
        inline_rdfa: inlineRdfaWithConfigView({ rdfaAware: true })(controller),
        block_rdfa: (node) => new BlockRDFaView(node),

        snippet_placeholder: snippetPlaceholderView(this.config.snippet)(
          controller,
        ),
        snippet: snippetView(this.config.snippet)(controller),
        structure: structureViewWithConfig(this.config.structure)(controller),
        mandatee_table: mandateeTableView(controller),
        person_variable: personVariableView(controller),
        autofilled_variable: autofilledVariableView(controller),
      };
    };
  }

  /**
   * Get the schema and plugins for the editor.
   * @param {boolean} isHeadless - Whether this is for a headless editor, as this requires
   * different config to work correctly
   **/
  getSchemaAndPlugins(isHeadless) {
    const schema = new Schema({
      nodes: {
        doc: docWithConfig({ rdfaAware: true }),
        paragraph,
        repaired_block: repairedBlockWithConfig({ rdfaAware: true }),
        structure: structureWithConfig(this.config.structure),
        list_item: listItemWithConfig({ enableHierarchicalList: true }),
        ordered_list: orderedListWithConfig({ enableHierarchicalList: true }),
        bullet_list: bulletListWithConfig({ enableHierarchicalList: true }),
        placeholder,
        ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
        date: date(this.config.date),
        regulatoryStatementNode,
        templateComment,
        text_variable,
        number,
        oslo_location: osloLocation(this.config.location),
        location,
        codelist,
        roadsign_regulation,
        mandatee_table,
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
        invisible_rdfa: invisibleRdfaWithConfig({ rdfaAware: true }),
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

    const plugins = [
      ...tablePlugins,
      tableKeymap,
      this.citationPlugin,
      createInvisiblesPlugin(
        [hardBreak, paragraphInvisible, headingInvisible],
        {
          shouldShowInvisibles: false,
        },
      ),
      linkPasteHandler(schema.nodes.link),
      listTrackingPlugin(),

      emberApplication({ application: getOwner(this) }),
    ];

    // The autofiller plugin messes with the headless editor by appending a transaction just
    // before the desired transactions run, meaning that the transactions are attempted to be
    // applied to a different state than intended.
    if (!isHeadless) {
      plugins.push(variableAutofillerPlugin(this.config.autofilledVariable));
    }

    return { schema, plugins };
  }

  getState = (html) => {
    const { schema, plugins } = this.getSchemaAndPlugins(true);
    const parser = ProseParser.fromSchema(schema);
    const doc = htmlToDoc(html, {
      schema: schema,
      parser,
    });

    const state = EditorState.create({
      doc,
      // We need to configure some additional (default) plugins for the headless editor
      // (they are already configured by default on the headful one)
      plugins: [
        defaultAttributeValueGeneration([
          {
            attribute: '__guid',
            generator() {
              return uuidv4();
            },
          },
          {
            attribute: '__rdfaId',
            generator() {
              return uuidv4();
            },
          },
        ]),
        removePropertiesOfDeletedNodes(),
        rdfaInfoPlugin(),
        ...plugins,
      ],
    });
    return state;
  };
}
