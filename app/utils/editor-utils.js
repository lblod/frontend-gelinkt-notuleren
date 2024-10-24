import {
  DCT,
  EXT,
  RDF,
  XSD,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { isSome } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { sayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { v4 as uuidv4 } from 'uuid';

export function tableCell(schema, width, content, header = false) {
  const nodetype = header ? schema.nodes.table_header : schema.nodes.table_cell;
  return nodetype.create(
    {
      colwidth: [width],
    },
    schema.nodes.paragraph.create(null, content),
  );
}

export function row(schema, nodes, header = false) {
  const cellwidth = 100 / nodes.length;
  return schema.nodes.table_row.create(
    null,

    nodes.map((node) => tableCell(schema, cellwidth, node, header)),
  );
}

export function replaceContent(tr, $pos, content) {
  const rangeToReplace = {
    from: $pos.pos + 1,
    to: $pos.pos + unwrap($pos.nodeAfter).nodeSize - 1,
  };
  return tr.replaceWith(rangeToReplace.from, rangeToReplace.to, content);
}

export function resourceNode(schema, resource, value) {
  return schema.nodes.inline_rdfa.create(
    {
      rdfaNodeType: 'resource',
      subject: resource,
    },
    schema.text(value),
  );
}

export function dateNode(schema, value) {
  const mappingResource = `http://data.lblod.info/mappings/${uuidv4()}`;
  const variableInstance = `http://data.lblod.info/variables/${uuidv4()}`;
  const variableId = uuidv4();

  return schema.nodes.date.create({
    rdfaNodeType: 'resource',
    subject: mappingResource,
    __rdfaId: variableId,
    properties: [
      {
        predicate: RDF('type').full,
        object: sayDataFactory.namedNode(EXT('Mapping').full),
      },
      {
        predicate: EXT('instance').full,
        object: sayDataFactory.namedNode(variableInstance),
      },
      {
        predicate: DCT('type').full,
        object: sayDataFactory.literal('date', XSD('date').namedNode),
      },
      value && {
        predicate: EXT('content').full,
        object: sayDataFactory.literal(value, XSD('date')),
      },
    ].filter(isSome),
    backlinks: [],
  });
}
