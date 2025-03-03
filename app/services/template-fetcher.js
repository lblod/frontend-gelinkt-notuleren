import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';

/**
 * @typedef {Object} Template
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
        ?template_version
        ?title
        ?fileId
        (GROUP_CONCAT(?context;SEPARATOR="|") as ?contexts)
        (GROUP_CONCAT(?disabledInContext;SEPARATOR="|") as ?disabledInContexts)
      WHERE {
        BIND("${name}" as ?title)
        ?uri mu:uuid ?uuid;
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
      const templates = bindings.map(this.bindingToTemplate(fileEndpoint));
      return templates[0];
    } else {
      return null;
    }
  };

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
      const templates = bindings.map(this.bindingToTemplate(fileEndpoint));
      return templates[0];
    } else {
      return null;
    }
  };
  fetch = task(async ({ templateType, abortSignal }) => {
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
      const templates = bindings.map(this.bindingToTemplate(fileEndpoint));
      return templates;
    } else {
      return [];
    }
  });

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
      return {
        title: binding.title.value,
        loadBody: async function () {
          const response = await fetch(
            `${fileEndpoint}/${binding.fileId.value}/download`,
          );
          this.body = await response.text();
        },
        contexts: binding.contexts.value
          ? binding.contexts.value.split('|')
          : [],
        disabledInContexts: binding.disabledInContexts.value
          ? binding.disabledInContexts.value.split('|')
          : // make the RB templates unavailable from the sidebar insert for now
            ['http://data.vlaanderen.be/ns/besluit#BehandelingVanAgendapunt'],
      };
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
