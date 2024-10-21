import { removePropertiesOfDeletedNodes } from '@lblod/ember-rdfa-editor/plugins/remove-properties-of-deleted-nodes';
import { defaultAttributeValueGeneration } from '@lblod/ember-rdfa-editor/plugins/default-attribute-value-generation';
import { rdfaInfoPlugin } from '@lblod/ember-rdfa-editor/plugins/rdfa-info';

import { v4 as uuidv4 } from 'uuid';
import { EditorState, ProseParser, Schema } from '@lblod/ember-rdfa-editor';
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
  bulletListWithConfig,
  listItemWithConfig,
  listTrackingPlugin,
  orderedListWithConfig,
} from '@lblod/ember-rdfa-editor/plugins/list';
import { tableNodes } from '@lblod/ember-rdfa-editor/plugins/table';
import {
  codelist,
  date,
  number,
  text_variable,
  person_variable,
  autofilled_variable,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/variable-plugin/variables';
import { regulatoryStatementNode } from '../../editor-plugins/regulatory-statements-plugin';
import { link } from '@lblod/ember-rdfa-editor/plugins/link';
import { inlineRdfaWithConfig } from '@lblod/ember-rdfa-editor/nodes/inline-rdfa';
import { osloLocation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/location-plugin/node';
import { roadsign_regulation } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/roadsign-regulation-plugin/nodes';
import { snippet } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet';
import { snippetPlaceholder } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/snippet-plugin/nodes/snippet-placeholder';
import { structure } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/structure-plugin/node';
import { templateComment } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/template-comments-plugin';
import { mandatee_table } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/mandatee-table-plugin/node';
import { blockquote } from '@lblod/ember-rdfa-editor/plugins/blockquote';
import { code_block } from '@lblod/ember-rdfa-editor/plugins/code';
import { color } from '@lblod/ember-rdfa-editor/plugins/color/marks/color';
import { highlight } from '@lblod/ember-rdfa-editor/plugins/highlight/marks/highlight';
import { image } from '@lblod/ember-rdfa-editor/plugins/image';
import { placeholder } from '@lblod/ember-rdfa-editor/plugins/placeholder';
import {
  em,
  strong,
  underline,
  strikethrough,
  subscript,
  superscript,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import { htmlToDoc } from '@lblod/ember-rdfa-editor/utils/_private/html-utils';
import { emberApplication } from '@lblod/ember-rdfa-editor/plugins/ember-application';
import { headingWithConfig } from '@lblod/ember-rdfa-editor/plugins/heading';
import { invisibleRdfaWithConfig } from '@lblod/ember-rdfa-editor/nodes';

const CONFIG = {
  date: {
    formats: [
      {
        key: 'short',
        dateFormat: 'dd/MM/yy',
        dateTimeFormat: 'dd/MM/yy HH:mm',
      },
      {
        key: 'long',
        dateFormat: 'EEEE dd MMMM yyyy',
        dateTimeFormat: 'PPPPp',
      },
    ],
    allowCustomFormat: true,
  },
  link: {
    interactive: true,
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
};
const SCHEMA = new Schema({
  nodes: {
    doc: docWithConfig({ rdfaAware: true }),
    paragraph,
    repaired_block: repairedBlockWithConfig({ rdfaAware: true }),
    structure,
    list_item: listItemWithConfig({ enableHierarchicalList: true }),
    ordered_list: orderedListWithConfig({ enableHierarchicalList: true }),
    bullet_list: bulletListWithConfig({ enableHierarchicalList: true }),
    placeholder,
    ...tableNodes({ tableGroup: 'block', cellContent: 'block+' }),
    date: date(CONFIG.date),
    regulatoryStatementNode,
    templateComment,
    text_variable,
    number,
    oslo_location: osloLocation(CONFIG.location),
    location,
    codelist,
    roadsign_regulation,
    mandatee_table,
    heading: headingWithConfig({ rdfaAware: true }),
    blockquote,
    snippet_placeholder: snippetPlaceholder,
    snippet: snippet(CONFIG.snippet),
    horizontal_rule,
    code_block,
    text,
    image,
    hard_break,
    block_rdfa: blockRdfaWithConfig({ rdfaAware: true }),
    invisible_rdfa: invisibleRdfaWithConfig({ rdfaAware: true }),
    inline_rdfa: inlineRdfaWithConfig({ rdfaAware: true }),
    link: link(CONFIG.link),
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

const PLUGINS = [
  listTrackingPlugin(),
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
];

export function headlessProsemirror(content, emberApp) {
  const parser = ProseParser.fromSchema(SCHEMA);
  const doc = htmlToDoc(content, {
    schema: SCHEMA,
    parser,
  });

  const state = EditorState.create({
    doc,
    plugins: [...PLUGINS, emberApplication({ application: emberApp })],
  });
  return state;
}
