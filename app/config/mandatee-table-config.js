import { findParentNodeClosestToPos } from '@curvenote/prosemirror-utils';
import {
  BESLUIT,
  MANDAAT,
  RDF,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/constants';
import { hasOutgoingNamedNodeTriple } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import { executeQuery } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';
import { SayDataFactory } from '@lblod/ember-rdfa-editor/core/say-data-factory';
import { addPropertyToNode } from '@lblod/ember-rdfa-editor/utils/rdfa-utils';
import { transactionCombinator } from '@lblod/ember-rdfa-editor/utils/transaction-utils';
import { rangordeStringToNumber } from '../utils/mandataris-rangorde';
import { bindingToObject } from '../utils/sparql';
import {
  dateNode,
  replaceContent,
  resourceNode,
  row,
} from '../utils/editor-utils';
import {
  BESTUURSFUNCTIE_CODES,
  BESTUURSPERIODES,
  LOKALE_VERKIEZINGEN,
} from './constants';
import { promiseProperties } from '../utils/promises';

export const IVGR_TAGS = /** @type {const} */ ([
  'IVGR2-LMB-1-geloofsbrieven',
  'IVGR3-LMB-1-eedafleggingen',
  'IVGR4-LMB-1-rangorde-gemeenteraadsleden',
  'IVGR5-LMB-1-splitsing-fracties',
  'IVGR5-LMB-2-grootte-fracties',
  'IVGR5-LMB-3-samenstelling-fracties',
  'IVGR7-LMB-1-kandidaat-schepenen',
  'IVGR7-LMB-2-ontvankelijkheid-schepenen',
  'IVGR8-LMB-1-verkozen-schepenen',
  'IVGR8-LMB-2-coalitie',
]);
/**
 * Function which returns the IVGR mandatee table config for a given meeting
 * @param {import("../models/zitting").default} meeting
 * @typedef {typeof IVGR_TAGS[number]} IVGR_TAG
 * @returns {Record<IVGR_TAG, unknown>}
 */
export const mandateeTableConfigIVGR = (meeting) => {
  return {
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
          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.GEMEENTERAADSLID}>.

          ?bestuursorgaan org:hasPost ?mandaat.
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
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
          const tableHeader = row(
            schema,
            [schema.text('Naam verkozene')],
            true,
          );
          const rows = bindings.map((binding) => {
            const { persoon_naam } = bindingToObject(binding);
            return row(schema, [schema.text(persoon_naam)]);
          });
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const transaction = replaceContent(state.tr, $pos, content);
          return {
            transaction,
            result: true,
            initialState: state,
          };
        };
      },
    },
    /**
     * **IVGR3: Eedaflegging van de verkozen gemeenteraadsleden**
     *
     * IVGR3-LMB-1: De gemeenteraad neemt kennis van de eedaflegging van de volgende verkozenen op datum van
     */
    'IVGR3-LMB-1-eedafleggingen': {
      query: () => {
        const sparqlQuery = /* sparql */ `
        PREFIX org: <http://www.w3.org/ns/org#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX lmb: <http://lblod.data.gift/vocabularies/lmb/>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
        PREFIX foaf: <http://xmlns.com/foaf/0.1/>
        SELECT DISTINCT ?mandataris ?mandataris_naam WHERE {
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
          ?bestuursorgaan org:hasPost ?mandaat.

          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.GEMEENTERAADSLID}>.

          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.

          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
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
            const { mandataris, mandataris_naam } = bindingToObject(binding);
            const datum_eedaflegging = meeting.gestartOpTijdstip.toISOString();
            return row(schema, [
              resourceNode(schema, mandataris, mandataris_naam),
              dateNode(schema, datum_eedaflegging),
            ]);
          });
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const factory = new SayDataFactory();
          const result = transactionCombinator(
            state,
            replaceContent(state.tr, $pos, content),
          )(
            bindings.map((binding) => {
              return addPropertyToNode({
                resource: decisionUri,
                property: {
                  predicate: MANDAAT('bekrachtigtAanstellingVan').full,
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
    /**
     * **IVGR4: Bepaling van de rangorde van de gemeenteraadsleden**
     *
     * IVGR4-LMB-1: De rangorde van de gemeenteraadsleden is als volgt vastgesteld
     */
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
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
          ?bestuursorgaan org:hasPost ?mandaat.

          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.GEMEENTERAADSLID}>.

          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          OPTIONAL {
            ?mandataris mandaat:rangorde ?mandataris_rang.
          }

          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
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
          const tableHeader = row(
            schema,
            [schema.text('Gemeenteraadslid'), schema.text('Rang')],
            true,
          );

          const bindings = queryResult.results.bindings
            .map((binding) => {
              const { mandataris_rang } = bindingToObject(binding);
              return {
                ...binding,
                rangnummer: rangordeStringToNumber(mandataris_rang),
              };
            })
            .sort((b1, b2) => {
              return (b1.rangnummer ?? Infinity) - (b2.rangnummer ?? Infinity);
            });
          const rows = bindings.map((binding) => {
            const { mandataris_naam, mandataris_rang } =
              bindingToObject(binding);
            return row(schema, [
              schema.text(mandataris_naam),
              mandataris_rang ? schema.text(mandataris_rang) : undefined,
            ]);
          });
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const transaction = replaceContent(state.tr, $pos, content);
          return {
            transaction,
            result: true,
            initialState: state,
          };
        };
      },
    },
    /**
     * **IVGR5: Vaststelling van de fracties**
     *
     * IVGR5-LMB-1: Splitsing fracties: één of meerdere lijsten hebben in de akte van voordracht van kandidaten aangegeven te zullen splitsen in twee fracties.
     */
    'IVGR5-LMB-1-splitsing-fracties': {
      query: async () => {
        const splitKandidatenlijstQuery = /* sparql */ `
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
        PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
        PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        PREFIX regorg: <https://www.w3.org/ns/regorg#>

        SELECT DISTINCT ?kandidatenlijst ?kandidatenlijst_naam ?fractie1 ?fractie2 ?fractie1_naam ?fractie2_naam WHERE {
          ?kandidatenlijst a <http://data.vlaanderen.be/ns/mandaat#Kandidatenlijst>.
          ?kandidatenlijst mandaat:behoortTot <${LOKALE_VERKIEZINGEN[2024]}>.
          ?kandidatenlijst skos:prefLabel ?kandidatenlijst_naam.
          ?fractie1 ext:geproduceerdDoor ?kandidatenlijst;
                    regorg:legalName ?fractie1_naam.
          ?fractie2 ext:geproduceerdDoor ?kandidatenlijst;
                    regorg:legalName ?fractie2_naam.
          FILTER(?fractie1 != ?fractie2 && ?fractie1 < ?fractie2)
        }
      `;
        const kandidatenlijstQueryResult = await executeQuery({
          query: splitKandidatenlijstQuery,
          endpoint: '/vendor-proxy/query',
        });
        const bindings = kandidatenlijstQueryResult.results.bindings;

        const promises = [];
        for (const binding of bindings) {
          const {
            kandidatenlijst,
            kandidatenlijst_naam,
            fractie1,
            fractie1_naam,
            fractie2,
            fractie2_naam,
          } = bindingToObject(binding);
          const entry = {
            uri: kandidatenlijst,
            naam: kandidatenlijst_naam,
            fractie1: {
              uri: fractie1,
              naam: fractie1_naam,
              leden: fetchFractieLeden(fractie1),
            },
            fractie2: {
              uri: fractie2,
              naam: fractie2_naam,
              leden: fetchFractieLeden(fractie2),
            },
          };
          promises.push(promiseProperties(entry, true));
        }
        return Promise.all(promises);
      },
      updateContent: (pos, kandidatenlijsten) => {
        return (state) => {
          const content = [];
          const { schema, doc } = state;
          const $pos = doc.resolve(pos);
          for (const kandidatenlijst of kandidatenlijsten) {
            content.push(
              schema.nodes.paragraph.create(null, [
                schema.text(
                  `${kandidatenlijst.naam} heeft in de akte van voordracht van kandidaten aangegeven te zullen splitsen in twee fracties.`,
                ),
                schema.nodes.hard_break.create(),
                schema.text(
                  `${kandidatenlijst.naam} splitst in ${kandidatenlijst.fractie1.naam} en ${kandidatenlijst.fractie2.naam}.`,
                ),
              ]),
            );
            content.push(
              createFractieLedenTable(kandidatenlijst.fractie1, schema),
            );
            content.push(
              createFractieLedenTable(kandidatenlijst.fractie2, schema),
            );
          }
          const transaction = replaceContent(state.tr, $pos, content);
          return {
            transaction,
            result: true,
            initialState: state,
          };
        };
      },
    },

    /**
     * **IVGR5: Vaststelling van de fracties**
     *
     * IVGR5-LMB-2: De gemeenteraad stelt de grootte van de fracties als volgt vast
     */
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
        SELECT DISTINCT ?fractie ?fractie_naam (COUNT(DISTINCT ?lid) as ?fractie_aantal_zetels) WHERE {
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.

          ?fractie org:memberOf ?bestuursorgaan.
          ?fractie regorg:legalName ?fractie_naam.
          # We want this to be optional, as it is possible there are 'fracties' without any electees
          OPTIONAL {
            ?mandataris org:hasMembership/org:organisation ?fractie.
            ?mandataris mandaat:isBestuurlijkeAliasVan ?lid.
            ?mandataris org:holds ?mandaat.

            ?mandaat org:role <${BESTUURSFUNCTIE_CODES.GEMEENTERAADSLID}>.
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
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const transaction = replaceContent(state.tr, $pos, content);
          return {
            transaction,
            result: true,
            initialState: state,
          };
        };
      },
    },
    /**
     * **IVGR5: Vaststelling van de fracties**
     *
     * IVGR5-LMB-3: De gemeenteraad stelt de samenstelling van de fracties voorlopig als volgt vast
     */
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
        PREFIX person: <http://www.w3.org/ns/person#>
        SELECT DISTINCT ?persoon ?persoon_naam ?fractie ?fractie_naam WHERE {
          ?persoon a person:Person.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?persoon_naam)

          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          ?mandataris org:hasMembership/org:organisation ?fractie.

          ?fractie regorg:legalName ?fractie_naam.

          ?mandataris org:holds ?mandaat.
          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.GEMEENTERAADSLID}>.

          ?bestuursorgaan org:hasPost ?mandaat.
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
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
            [schema.text('Mandataris'), schema.text('Fractie')],
            true,
          );
          const rows = bindings.map((binding) => {
            const { persoon_naam, fractie_naam } = bindingToObject(binding);
            return row(schema, [
              schema.text(persoon_naam),
              schema.text(fractie_naam),
            ]);
          });
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const transaction = replaceContent(state.tr, $pos, content);
          return {
            transaction,
            result: true,
            initialState: state,
          };
        };
      },
    },
    /**
     * **IVGR7: Verkiezing van de schepenen**
     *
     * IVGR7-LMB-1: De voorgedragen kandidaat-schepenen zijn
     */
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
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
          ?bestuursorgaan org:hasPost ?mandaat.

          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.SCHEPEN}>.

          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.

          ?mandataris mandaat:rangorde ?mandataris_rang.
          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)
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
          const tableHeader = row(
            schema,
            [schema.text('Schepen'), schema.text('Rang')],
            true,
          );
          const bindings = queryResult.results.bindings
            .map((binding) => {
              const { mandataris_rang } = bindingToObject(binding);
              return {
                ...binding,
                rangnummer: rangordeStringToNumber(mandataris_rang),
              };
            })
            .sort((b1, b2) => {
              return (b1.rangnummer ?? Infinity) - (b2.rangnummer ?? Infinity);
            });
          const rows = bindings.map((binding) => {
            const { mandataris, mandataris_naam, mandataris_rang } =
              bindingToObject(binding);
            return row(schema, [
              resourceNode(schema, mandataris, mandataris_naam),
              schema.text(mandataris_rang),
            ]);
          });
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const factory = new SayDataFactory();
          const result = transactionCombinator(
            state,
            replaceContent(state.tr, $pos, content),
          )(
            bindings.map((binding) => {
              return addPropertyToNode({
                resource: decisionUri,
                property: {
                  predicate: MANDAAT('bekrachtigtAanstellingVan').full,
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
    /**
     * **IVGR7: Verkiezing van de schepenen**
     *
     * IVGR7-LMB-2: De gemeenteraad neemt kennis van de ontvankelijkheid van de gezamenlijke akte van voordracht
     * en verklaart de voorgedragen kandidaat-schepenen verkozen in de rangorde van de gezamenlijke akte van voordracht van kandidaat-schepenen
     */
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
        SELECT DISTINCT ?mandataris ?mandataris_rang ?mandataris_naam ?mandataris_status ?mandaat_einddatum ?mandataris_opvolger WHERE {
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
          ?bestuursorgaan org:hasPost ?mandaat.

          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.SCHEPEN}>.

          ?mandataris org:holds ?mandaat.
          ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
          ?mandataris mandaat:rangorde ?mandataris_rang.
          ?mandataris mandaat:status/skos:prefLabel ?mandataris_status.

          ?persoon persoon:gebruikteVoornaam ?voornaam.
          ?persoon foaf:familyName ?achternaam.
          BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?mandataris_naam)

          VALUES ?mandaat_einddatum { undef }
          # TODO: unsure how we will fetch the 'opvolger'
          VALUES ?mandataris_opvolger { undef }
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
          const bindings = queryResult.results.bindings
            .map((binding) => {
              const { mandataris_rang } = bindingToObject(binding);
              return {
                ...binding,
                rangnummer: rangordeStringToNumber(mandataris_rang),
              };
            })
            .sort((b1, b2) => {
              return b1.rangnummer - b2.rangnummer;
            });
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
              mandaat_einddatum,
              mandataris_opvolger,
            } = bindingToObject(binding);
            const mandaat_begindatum = meeting.gestartOpTijdstip.toISOString();
            return row(schema, [
              schema.text(mandataris_rang),
              resourceNode(schema, mandataris, mandataris_naam),
              schema.text(mandataris_status),
              dateNode(schema, mandaat_begindatum),
              mandaat_einddatum
                ? dateNode(schema, mandaat_einddatum)
                : undefined,
              mandataris_opvolger
                ? schema.text(mandataris_opvolger)
                : undefined,
            ]);
          });
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const factory = new SayDataFactory();
          const result = transactionCombinator(
            state,
            replaceContent(state.tr, $pos, content),
          )(
            bindings.map((mandatee) => {
              return addPropertyToNode({
                resource: decisionUri,
                property: {
                  predicate: MANDAAT('bekrachtigtAanstellingVan').full,
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
    /**
     * **IVGR8: Aanduiding en eedaflegging van de aangewezen-burgemeester**
     *
     * IVGR8-LMB-1: De volgende gemeenteraadsleden zijn verkozen als schepen
     */
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
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
          ?bestuursorgaan org:hasPost ?mandaat.

          ?mandaat org:role <${BESTUURSFUNCTIE_CODES.SCHEPEN}>.

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
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
          const factory = new SayDataFactory();
          const result = transactionCombinator(
            state,
            replaceContent(state.tr, $pos, content),
          )(
            bindings.map((binding) => {
              return addPropertyToNode({
                resource: decisionUri,
                property: {
                  predicate: MANDAAT('bekrachtigtAanstellingVan').full,
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
    /**
     * **IVGR8: Aanduiding en eedaflegging van de aangewezen-burgemeester**
     *
     * IVGR8-LMB-2: Op basis van de verkiezing van de schepenen en de voorzitter van het bijzonder comité voor de sociale dienst behoren de volgende fracties tot de coalitie
     */
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
          ?bestuursorgaan lmb:heeftBestuursperiode <${BESTUURSPERIODES['2019-2025']}>.
          ?bestuursorgaan org:hasPost ?mandaat.

          ?mandaat org:role ?role.
          VALUES ?role {
            <${BESTUURSFUNCTIE_CODES.SCHEPEN}>
            <${BESTUURSFUNCTIE_CODES.VOORZITTER_BCSD}>
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
          const content = schema.nodes.table.create(null, [
            tableHeader,
            ...rows,
          ]);
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
};

async function fetchFractieLeden(fractieUri) {
  const sparqlQuery = /* sparql */ `
    PREFIX org: <http://www.w3.org/ns/org#>
    PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
    PREFIX persoon: <http://data.vlaanderen.be/ns/persoon#>
    PREFIX person: <http://www.w3.org/ns/person#>
    PREFIX foaf: <http://xmlns.com/foaf/0.1/>

    SELECT DISTINCT ?persoon ?persoon_naam WHERE {
      ?persoon a person:Person .
      ?persoon persoon:gebruikteVoornaam ?voornaam.
      ?persoon foaf:familyName ?achternaam.
      BIND(CONCAT(?voornaam, " ", ?achternaam) AS ?persoon_naam)

      ?mandataris mandaat:isBestuurlijkeAliasVan ?persoon.
      ?mandataris org:hasMembership/org:organisation <${fractieUri}>.
      ?mandataris org:holds ?mandaat.

      ?mandaat org:role <${BESTUURSFUNCTIE_CODES.GEMEENTERAADSLID}>.
    }
  `;
  const result = await executeQuery({
    query: sparqlQuery,
    endpoint: '/vendor-proxy/query',
  });
  return result.results.bindings.map(bindingToObject) ?? [];
}

function createFractieLedenTable(fractie, schema) {
  const { naam, leden } = fractie;
  const tableHeader = row(schema, [schema.text(`Behoren tot ${naam}`)], true);
  const rows = leden.map((lid) => {
    return row(schema, [schema.text(lid.naam)]);
  });
  return schema.nodes.table.create(null, [tableHeader, ...rows]);
}
