import { findParentNodeClosestToPos } from '@curvenote/prosemirror-utils';
import {
  BESLUIT,
  DCT,
  EXT,
  RDF,
  XSD,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { hasOutgoingNamedNodeTriple } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import { executeQuery } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';
import { SayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { NotImplementedError } from '@lblod/ember-rdfa-editor/utils/_private/errors';
import { addPropertyToNode } from '@lblod/ember-rdfa-editor/utils/rdfa-utils';
import { transactionCombinator } from '@lblod/ember-rdfa-editor/utils/transaction-utils';
import { v4 as uuidv4 } from 'uuid';
import { sayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';

function tableCell(schema, width, content, header = false) {
  const nodetype = header ? schema.nodes.table_header : schema.nodes.table_cell;
  return nodetype.create(
    {
      colwidth: [width],
    },
    schema.nodes.paragraph.create(null, content),
  );
}

function row(schema, nodes, header = false) {
  const cellwidth = 100 / nodes.length;
  return schema.nodes.table_row.create(
    null,

    nodes.map((node) => tableCell(schema, cellwidth, node, header)),
  );
}

function replaceContent(tr, $pos, content) {
  const rangeToReplace = {
    from: $pos.pos + 1,
    to: $pos.pos + unwrap($pos.nodeAfter).nodeSize - 1,
  };
  return tr.replaceWith(rangeToReplace.from, rangeToReplace.to, content);
}

function resourceNode(schema, resource, value) {
  return schema.nodes.inline_rdfa.create(
    {
      rdfaNodeType: 'resource',
      subject: resource,
    },
    schema.text(value),
  );
}

function dateNode(schema, value) {
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
      {
        predicate: EXT('content').full,
        object: sayDataFactory.literal(value, XSD('date')),
      },
    ],
    backlinks: [],
  });
}

/**
 *
 * Converts a sparql binding to a simple object contain a mapping of the binding keys to their values
 */
function bindingToObject(binding) {
  const result = {};
  for (let key in binding) {
    result[key] = binding[key].value;
  }
  return result;
}

export const MANDATEE_TABLE_SAMPLE_CONFIG = {
  'IVGR2-LMB-1-geloofsbrieven': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX person: <http://www.w3.org/ns/person#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        SELECT DISTINCT ?persoon ?persoon_naam WHERE {
          ?persoon a person:Person .
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?persoon_naam)
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          ?mandataris org:holds ?mandaat.
          ?bestuursorgaan org:hasPost ?mandaat.
          # TODO: replace this by the correct bestuursperiode
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
        }
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { schema, doc } = state;
        const $pos = doc.resolve(pos);
        const bindings = queryResult.results.bindings;
        const tableHeader = row(schema, [schema.text('Naam verkozene')], true);
        const rows = bindings.map((binding) => {
          const { persoon_naam } = bindingToObject(binding);
          return row(schema, [schema.text(persoon_naam)]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const transaction = replaceContent(state.tr, $pos, content);
        return {
          transaction,
          result: true,
          initialState: state,
        };
      };
    },
  },
  'IVGR3-LMB-1-eedafleggingen': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?mandataris ?mandataris_naam ?mandataris_datum_eedaflegging WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
          # TODO: replace this by the correct date (start or ending of the inauguration meeting)
          BIND(NOW() AS ?mandataris_datum_eedaflegging)
        }
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = findParentNodeClosestToPos($pos, (node) => {
          return hasOutgoingNamedNodeTriple(
            node.attrs,
            RDF('type'),
            BESLUIT('Besluit'),
          );
        })?.node.attrs.subject;
        if (!decisionUri) {
          throw new Error(
            'Could not find decision to sync mandatee table with',
          );
        }
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [schema.text('Naam verkozene'), schema.text('Datum eedaflegging')],
          true,
        );
        const rows = bindings.map((binding) => {
          const { mandataris, mandataris_naam, mandataris_datum_eedaflegging } =
            bindingToObject(binding);
          return row(schema, [
            resourceNode(schema, mandataris, mandataris_naam),
            dateNode(schema, mandataris_datum_eedaflegging),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          bindings.map((binding) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(binding['mandataris'].value),
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
  'IVGR4-LMB-1-rangorde-gemeenteraadsleden': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?mandataris ?mandataris_naam ?mandataris_rang WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          # TODO: Do we only want information on 'gemeenteraadsleden'?
          ?mandaat org:role <http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011>.
          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          # TODO: ?rangorde is a string or number?
          ?mandataris mandaat:rangorde ?mandataris_rang.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
        }
        ORDER BY ?mandataris_rang
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [schema.text('Gemeenteraadslid'), schema.text('Rang')],
          true,
        );
        const rows = bindings.map((binding) => {
          const { mandataris_naam, mandataris_rang } = bindingToObject(binding);
          return row(schema, [
            schema.text(mandataris_naam),
            schema.text(mandataris_rang),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const transaction = replaceContent(state.tr, $pos, content);
        return {
          transaction,
          result: true,
          initialState: state,
        };
      };
    },
  },
  'IVGR5-LMB-1-splitsing-fracties': {
    query: () => {
      throw new NotImplementedError();
    },
    updateContent: () => {
      throw new NotImplementedError();
    },
  },
  'IVGR5-LMB-2-grootte-fracties': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        # TODO: http or https?
        PREFIX regorg: <https://www.w3.org/ns/regorg#>
        SELECT DISTINCT ?fractie ?fractie_naam (COUNT(DISTINCT ?lidmaatschap) as ?fractie_aantal_zetels) WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?fractie org:memberOf ?bestuursorgaan.
          ?fractie regorg:legalName ?fractie_naam.
          # We want this to be optional, as it is possible there are 'fracties' without any electees
          OPTIONAL {
            ?lidmaatschap org:organisation ?fractie.
          }
        }
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [schema.text('Fractie'), schema.text('Aantal zetels')],
          true,
        );
        const rows = bindings.map((binding) => {
          const { fractie_naam, fractie_aantal_zetels } =
            bindingToObject(binding);
          return row(schema, [
            schema.text(fractie_naam),
            schema.text(fractie_aantal_zetels),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const transaction = replaceContent(state.tr, $pos, content);
        return {
          transaction,
          result: true,
          initialState: state,
        };
      };
    },
  },
  'IVGR5-LMB-3-samenstelling-fracties': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX regorg: <https://www.w3.org/ns/regorg#>
        SELECT DISTINCT ?mandataris ?mandataris_naam ?fractie ?fractie_naam WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)

          ?mandataris org:hasMembership/org:organisation ?fractie.
          ?fractie regorg:legalName ?fractie_naam.
        }
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = findParentNodeClosestToPos($pos, (node) => {
          return hasOutgoingNamedNodeTriple(
            node.attrs,
            RDF('type'),
            BESLUIT('Besluit'),
          );
        })?.node.attrs.subject;
        if (!decisionUri) {
          throw new Error(
            'Could not find decision to sync mandatee table with',
          );
        }
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [schema.text('Mandataris'), schema.text('Fractie')],
          true,
        );
        const rows = bindings.map((binding) => {
          const { mandataris, mandataris_naam, fractie_naam } =
            bindingToObject(binding);
          return row(schema, [
            resourceNode(schema, mandataris, mandataris_naam),
            schema.text(fractie_naam),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          bindings.map((binding) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(binding['mandataris'].value),
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
  'IVGR7-LMB-1-kandidaat-schepenen': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?mandataris ?mandataris_naam ?mandataris_rang WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          # Filter on 'schepen'
          ?mandaat org:role <http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000014>.
          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          # TODO: ?rangorde is a string or number?
          ?mandataris mandaat:rangorde ?mandataris_rang.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
        }
        # TODO: Unsure how we will sort 'rang'
        ORDER BY ?mandataris_rang
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = findParentNodeClosestToPos($pos, (node) => {
          return hasOutgoingNamedNodeTriple(
            node.attrs,
            RDF('type'),
            BESLUIT('Besluit'),
          );
        })?.node.attrs.subject;
        if (!decisionUri) {
          throw new Error(
            'Could not find decision to sync mandatee table with',
          );
        }
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [schema.text('Schepen'), schema.text('Rang')],
          true,
        );
        const rows = bindings.map((binding) => {
          const { mandataris, mandataris_naam, mandataris_rang } =
            bindingToObject(binding);
          return row(schema, [
            resourceNode(schema, mandataris, mandataris_naam),
            schema.text(mandataris_rang),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          bindings.map((binding) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(binding['mandataris'].value),
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
  'IVGR7-LMB-2-ontvankelijkheid-schepenen': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        SELECT DISTINCT ?mandataris ?mandataris_rang ?mandataris_naam ?mandataris_status ?mandaat_begindatum ?mandaat_einddatum ?mandataris_opvolger WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          # Filter on 'schepen'
          ?mandaat org:role <http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000014>.
          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          # TODO: ?rangorde is a string or number?
          ?mandataris mandaat:rangorde ?mandataris_rang.
          ?mandataris mandaat:status/skos:prefLabel ?mandataris_status.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
          # TODO: This should be the date of the meeting
          BIND(NOW() as ?mandaat_begindatum)
          VALUES ?mandaat_einddatum { undef }
          # TODO: unsure how we will fetch the 'opvolger'
          VALUES ?mandataris_opvolger { undef }

        }
        # TODO: Unsure how we will sort 'rang'
        ORDER BY ?mandataris_rang
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = findParentNodeClosestToPos($pos, (node) => {
          return hasOutgoingNamedNodeTriple(
            node.attrs,
            RDF('type'),
            BESLUIT('Besluit'),
          );
        })?.node.attrs.subject;
        if (!decisionUri) {
          throw new Error(
            'Could not find decision to sync mandatee table with',
          );
        }
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [
            schema.text('Rang'),
            schema.text('Schepen'),
            schema.text('Status'),
            schema.text('Begindatum mandaat'),
            schema.text('Einddatum mandaat'),
            schema.text('Opvolger'),
          ],
          true,
        );
        const rows = bindings.map((binding) => {
          const {
            mandataris,
            mandataris_rang,
            mandataris_naam,
            mandataris_status,
            mandaat_begindatum,
            mandaat_einddatum,
            mandataris_opvolger,
          } = bindingToObject(binding);
          return row(schema, [
            schema.text(mandataris_rang),
            resourceNode(schema, mandataris, mandataris_naam),
            schema.text(mandataris_status),
            dateNode(schema, mandaat_begindatum),
            mandaat_einddatum ? dateNode(schema, mandaat_einddatum) : undefined,
            mandataris_opvolger ? schema.text(mandataris_opvolger) : undefined,
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          bindings.map((mandatee) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(mandatee['mandataris'].value),
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
  'IVGR8-LMB-1-verkozen-schepenen': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX regorg: <https://www.w3.org/ns/regorg#>
        SELECT DISTINCT ?mandataris ?mandataris_naam ?fractie ?fractie_naam WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          # Filter on 'schepen'
          ?mandaat org:role <http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000014>.
          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
          OPTIONAL {
            ?mandataris org:hasMembership/org:organisation ?fractie.
            ?fractie regorg:legalName ?fractie_naam.
          }
        }
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const decisionUri = findParentNodeClosestToPos($pos, (node) => {
          return hasOutgoingNamedNodeTriple(
            node.attrs,
            RDF('type'),
            BESLUIT('Besluit'),
          );
        })?.node.attrs.subject;
        if (!decisionUri) {
          throw new Error(
            'Could not find decision to sync mandatee table with',
          );
        }
        const bindings = queryResult.results.bindings;
        const tableHeader = row(
          schema,
          [schema.text('Schepen'), schema.text('Fractie')],
          true,
        );
        const rows = bindings.map((binding) => {
          const { mandataris, mandataris_naam, fractie_naam } =
            bindingToObject(binding);
          return row(schema, [
            resourceNode(schema, mandataris, mandataris_naam),
            schema.text(fractie_naam ?? ''),
          ]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const factory = new SayDataFactory();
        const result = transactionCombinator(
          state,
          replaceContent(state.tr, $pos, content),
        )(
          bindings.map((binding) => {
            return addPropertyToNode({
              resource: decisionUri,
              property: {
                predicate: EXT('appoints').full,
                object: factory.resourceNode(binding['mandataris'].value),
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
  'IVGR8-LMB-2-coalitie': {
    query: () => {
      const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        PREFIX regorg: <https://www.w3.org/ns/regorg#>
        SELECT DISTINCT ?fractie ?fractie_naam WHERE {
          # TODO: replace this by the correct 'bestuursperiode'
          ?bestuursorgaan lmb:heeftBestuursperiode <http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca>.
          ?bestuursorgaan org:hasPost ?mandaat.
          # Filter on 'schepen', 'voorzitter van het bijzonder comité voor de sociale dienst'
          ?mandaat org:role ?role.
          VALUES ?role {
            <http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e00001a>
            <http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000014>
          }
          ?mandataris org:holds ?mandaat.

          ?mandataris org:hasMembership/org:organisation ?fractie.
          ?fractie regorg:legalName ?fractie_naam.
        }
      `;
      return executeQuery({
        query: sparqlQuery,
        endpoint: '/vendor-proxy/query',
      });
    },
    updateContent: (pos, queryResult) => {
      return (state) => {
        const { doc, schema } = state;
        const $pos = doc.resolve(pos);
        const bindings = queryResult.results.bindings;
        const tableHeader = row(schema, [schema.text('Fractie')], true);
        const rows = bindings.map((binding) => {
          const { fractie_naam } = bindingToObject(binding);
          return row(schema, [schema.text(fractie_naam)]);
        });
        const content = schema.nodes.table.create(null, [tableHeader, ...rows]);
        const transaction = replaceContent(state.tr, $pos, content);
        return {
          transaction,
          result: true,
          initialState: state,
        };
      };
    },
  },
};
