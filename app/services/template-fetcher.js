import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/owner';
import {
  executeCountQuery,
  executeQuery,
  sparqlEscapeString,
  sparqlEscapeUri,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';

/**
 * @typedef {Object} Template
 * @property {string} uri
 * @property {string} title
 * @property {string} body
 * @property {[string]} contexts
 * @property {[number]} disabledInContexts
 * @property {() => Promise<void>} [loadBody]
 */

export default class TemplateFetcher extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked roles = [];

  fetchByTemplateName = async ({ name, abortSignal }) => {
    const config = getOwner(this).resolveRegistration('config:environment');
    const fileEndpoint = config.regulatoryStatementFileEndpoint;
    const sparqlEndpoint = config.regulatoryStatementEndpoint;

    const sparqlQuery = `
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX pav: <http://purl.org/pav/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX schema: <http://schema.org/>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      SELECT
        ?template
        ?template_version
        ?title
        ?fileId
        (GROUP_CONCAT(?context;SEPARATOR="|") as ?contexts)
        (GROUP_CONCAT(?disabledInContext;SEPARATOR="|") as ?disabledInContexts)
      WHERE {
        BIND("${name}" as ?title)
        ?template mu:uuid ?uuid;
          pav:hasCurrentVersion ?template_version.
        ?template_version mu:uuid ?fileId;
                          dct:title ?title.
        OPTIONAL {
          ?template_version schema:validThrough ?validThrough.
        }
        OPTIONAL {
          ?template_version ext:context ?context.
        }
        OPTIONAL {
          ?template_version ext:disabledInContext ?disabledInContext.
        }
        FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
      }
      GROUP BY ?template ?template_version ?title ?fileId
      ORDER BY LCASE(REPLACE(STR(?title), '^ +| +$', ''))
    `;

    const response = await this.sendQuery(
      sparqlEndpoint,
      sparqlQuery,
      abortSignal,
    );
    if (response.ok) {
      const json = await response.json();
      const bindings = json.results.bindings;
      const templates = bindings.map(this.bindingToTemplate(fileEndpoint));
      return templates[0];
    } else {
      return null;
    }
  };

  // TODO This is unused. Remove it?
  fetchByUri = async ({ uri, abortSignal }) => {
    const config = getOwner(this).resolveRegistration('config:environment');
    const fileEndpoint = config.regulatoryStatementFileEndpoint;
    const sparqlEndpoint = config.regulatoryStatementEndpoint;

    const sparqlQuery = `
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX pav: <http://purl.org/pav/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX schema: <http://schema.org/>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      SELECT
        ?template_version
        ?title
        ?fileId
        (GROUP_CONCAT(?context;SEPARATOR="|") as ?contexts)
        (GROUP_CONCAT(?disabledInContext;SEPARATOR="|") as ?disabledInContexts)
      WHERE {
        <${uri}> mu:uuid ?uuid;
          pav:hasCurrentVersion ?template_version.
        ?template_version mu:uuid ?fileId;
                          dct:title ?title.
        OPTIONAL {
          ?template_version schema:validThrough ?validThrough.
        }
        OPTIONAL {
          ?template_version ext:context ?context.
        }
        OPTIONAL {
          ?template_version ext:disabledInContext ?disabledInContext.
        }
        FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
      }
      GROUP BY ?template_version ?title ?fileId
      ORDER BY LCASE(REPLACE(STR(?title), '^ +| +$', ''))
    `;

    const response = await this.sendQuery(
      sparqlEndpoint,
      sparqlQuery,
      abortSignal,
    );
    if (response.ok) {
      const json = await response.json();
      const bindings = json.results.bindings;
      const templates = bindings.map((binding) =>
        this.bindingToTemplate(fileEndpoint)({
          template: { value: uri },
          ...binding,
        }),
      );
      return templates[0];
    } else {
      return null;
    }
  };
  fetch = task(
    async ({
      templateType,
      titleFilter,
      pagination,
      favourites = [],
      abortSignal,
    }) => {
      const config = getOwner(this).resolveRegistration('config:environment');
      const fileEndpoint = config.regulatoryStatementFileEndpoint;
      const sparqlEndpoint = config.regulatoryStatementEndpoint;
      const filterQuery = !titleFilter
        ? ''
        : `FILTER(CONTAINS(LCASE(?title), LCASE(${sparqlEscapeString(titleFilter)})))`;
      const paginationQuery = !pagination
        ? ''
        : `LIMIT ${pagination.pageSize} OFFSET ${pagination.pageNumber * pagination.pageSize}`;
      const sparqlQuery = `
        PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
        PREFIX pav: <http://purl.org/pav/>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX schema: <http://schema.org/>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        SELECT
          ?template
          ?template_version
          ?title
          ?fileId
          (GROUP_CONCAT(?context;SEPARATOR="|") as ?contexts)
          (GROUP_CONCAT(?disabledInContext;SEPARATOR="|") as ?disabledInContexts)
        WHERE {
          ?template a <${templateType}>;
            mu:uuid ?uuid;
            pav:hasCurrentVersion ?template_version.
          ?template_version mu:uuid ?fileId;
                            dct:title ?title.
          OPTIONAL {
            ?template_version schema:validThrough ?validThrough.
          }
          OPTIONAL {
            ?template_version ext:context ?context.
          }
          OPTIONAL {
            ?template_version ext:disabledInContext ?disabledInContext.
          }
          BIND(IF(?template IN (${favourites.map(sparqlEscapeUri).join(',')}), 1, 0) as ?isFav)
          FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
          ${filterQuery}
        }
        GROUP BY ?isFav ?template ?template_version ?title ?fileId
        ORDER BY DESC(?isFav) LCASE(REPLACE(STR(?title), '^ +| +$', ''))
        ${paginationQuery}
      `;
      const countQuery = `
        PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
        PREFIX pav: <http://purl.org/pav/>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX schema: <http://schema.org/>
        PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
        SELECT (count(?template) as ?count)
        WHERE {
          ?template a <${templateType}>;
            mu:uuid ?uuid;
            pav:hasCurrentVersion ?template_version.
          ?template_version mu:uuid ?fileId;
                            dct:title ?title.
          OPTIONAL {
            ?template_version schema:validThrough ?validThrough.
          }
          FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
          ${filterQuery}
        }
      `;
      const [response, resultCount] = await Promise.all([
        executeQuery({
          endpoint: sparqlEndpoint,
          query: sparqlQuery,
          abortSignal,
        }),
        executeCountQuery({
          endpoint: sparqlEndpoint,
          query: countQuery,
          abortSignal,
        }),
      ]);
      const bindings = response.results.bindings;
      const templates = bindings.map(this.bindingToTemplate(fileEndpoint));
      return [templates, resultCount];
    },
  );

  /**
   * @param {string} sparqlQuery
   * @returns {string}
   */
  queryToFormBody(sparqlQuery) {
    const details = {
      query: sparqlQuery,
      format: 'application/json',
    };
    let formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(details[property]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');
    return formBody;
  }
  bindingToTemplate(fileEndpoint) {
    /** @return {Template} */
    return (binding) => {
      const template = {
        uri: binding.template.value,
        title: binding.title.value,
        loadBody: async function () {
          const response = await fetch(
            `${fileEndpoint}/${binding.fileId.value}/download`,
          );
          template.body = await response.text();
        },
        contexts: binding.contexts.value
          ? binding.contexts.value.split('|')
          : [],
        disabledInContexts: binding.disabledInContexts.value
          ? binding.disabledInContexts.value.split('|')
          : // make the RB templates unavailable from the sidebar insert for now
            ['http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt'],
      };
      return template;
    };
  }
  /**
   * @param {string} endpoint
   * @param {string} sparqlQuery
   * @param {AbortSignal} [abortSignal]
   * @returns {Promise<Response>}
   */
  async sendQuery(endpoint, sparqlQuery, abortSignal) {
    const formBody = this.queryToFormBody(sparqlQuery);
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
      signal: abortSignal,
    });
    return response;
  }
}
