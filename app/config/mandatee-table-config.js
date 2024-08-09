import { findParentNodeClosestToPos } from '@curvenote/prosemirror-utils';
import {
  BESLUIT,
  EXT,
  RDF,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { hasOutgoingNamedNodeTriple } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { executeQuery } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';
import { SayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { addPropertyToNode } from '@lblod/ember-rdfa-editor/utils/rdfa-utils';
import { transactionCombinator } from '@lblod/ember-rdfa-editor/utils/transaction-utils';

function tableCell(schema, value, width) {
  return schema.nodes.table_cell.create(
    null,
    schema.nodes.paragraph.create(
      {
        colwidth: [width],
      },
      schema.text(value),
    ),
  );
}

function resourceCell(schema, value, resource, width) {
  return schema.nodes.table_cell.create(
    {
      colwidth: [width],
    },
    schema.nodes.paragraph.create(
      null,
      schema.nodes.inline_rdfa.create(
        {
          rdfaNodeType: 'resource',
          subject: resource,
        },
        schema.text(value),
      ),
    ),
  );
}

function tableHeaderCell(schema, value, width) {
  return schema.nodes.table_header.create(
    null,
    schema.nodes.paragraph.create(
      {
        colwidth: [width],
      },
      schema.text(value),
    ),
  );
}

function replaceContent(tr, $pos, content) {
  const rangeToReplace = {
    from: $pos.pos + 1,
    to: $pos.pos + unwrap($pos.nodeAfter).nodeSize - 1,
  };
  return tr.replaceWith(rangeToReplace.from, rangeToReplace.to, content);
}

export const MANDATEE_TABLE_SAMPLE_CONFIG = {
  eedafleggingen: {
    query: () => {
      const sparqlQuery = `PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        SELECT DISTINCT ?mandatee ?name ?start WHERE {
          ?mandatee a mandaat:Mandataris;
                  mandaat:isBestuurlijkeAliasVan ?person;
                  mandaat:start ?start.

          ?person foaf:familyName ?lastName;
                  persoon:gebruikteVoornaam ?firstName.
          BIND(CONCAT(STR( ?firstName ), " ", STR( ?lastName ) ) AS ?name ) .
        }
        LIMIT 10`;
      return executeQuery({
        query: sparqlQuery,
        endpoint: 'http://localhost/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { schema, doc } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = unwrap(
          findParentNodeClosestToPos($pos, (node) => {
            return hasOutgoingNamedNodeTriple(
              node.attrs,
              RDF('type'),
              BESLUIT('Besluit'),
            );
          }),
        ).node.attrs.subject;
        if (!decisionUri) {
          return { result: false, initialState: state, transaction: state.tr };
        }

        const mandatees = queryResult.results.bindings;
        const cellWidth = 50;
        const tableHeader = schema.nodes.table_row.create(null, [
          tableHeaderCell(schema, 'Naam verkozene', cellWidth),
          tableHeaderCell(schema, 'Datum eedaflegging', cellWidth),
        ]);
        const rows = mandatees.map((mandatee) => {
          const name = mandatee['name'].value;
          const start = mandatee['start'].value;
          const mandateeUri = mandatee['mandatee'].value;
          return schema.nodes.table_row.create(null, [
            resourceCell(schema, name, mandateeUri, cellWidth),
            tableCell(schema, start, cellWidth),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          mandatees.map((mandatee) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(mandatee['mandatee'].value),
              },
            });
          }),
        );
        return {
          transaction: result.transaction,
          result: true,
          initialState: state,
        };
      };
    },
  },
  'naam-status-rol': {
    query: () => {
      const sparqlQuery = `PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX org: <http://www.w3.org/ns/org#>
        SELECT DISTINCT ?mandatee ?name ?status ?role WHERE {
            ?mandatee a mandaat:Mandataris;
              mandaat:status/skos:prefLabel ?status;
              mandaat:isBestuurlijkeAliasVan ?person.
            ?person foaf:familyName ?lastName;
              persoon:gebruikteVoornaam ?firstName.
            ?mandaat org:role/skos:prefLabel ?role.
            BIND(CONCAT(STR( ?firstName ), " ", STR( ?lastName ) ) AS ?name ) .
        }
        LIMIT 10`;
      return executeQuery({
        query: sparqlQuery,
        endpoint: 'http://localhost/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = unwrap(
          findParentNodeClosestToPos($pos, (node) => {
            return hasOutgoingNamedNodeTriple(
              node.attrs,
              RDF('type'),
              BESLUIT('Besluit'),
            );
          }),
        ).node.attrs.subject;
        if (!decisionUri) {
          return { initialState: state, result: false, transaction: state.tr };
        }
        const mandatees = queryResult.results.bindings;
        const cellWidth = 100 / 3;
        const tableHeader = schema.nodes.table_row.create(null, [
          tableHeaderCell(schema, 'Naam verkozene', cellWidth),
          tableHeaderCell(schema, 'Status', cellWidth),
          tableHeaderCell(schema, 'Rol', cellWidth),
        ]);
        const rows = mandatees.map((mandatee) => {
          const name = mandatee['name'].value;
          const status = mandatee['status'].value;
          const role = mandatee['role'].value;
          const mandateeUri = mandatee['mandatee'].value;
          return schema.nodes.table_row.create(null, [
            resourceCell(schema, name, mandateeUri, cellWidth),
            tableCell(schema, status, cellWidth),
            tableCell(schema, role, cellWidth),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          mandatees.map((mandatee) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(mandatee['mandatee'].value),
              },
            });
          }),
        );
        return {
          transaction: result.transaction,
          result: true,
          initialState: state,
        };
      };
    },
  },
};
