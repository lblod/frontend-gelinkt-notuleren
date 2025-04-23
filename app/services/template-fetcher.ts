import Service, { service } from '@ember/service';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/owner';
import { type InternalOwner } from '@ember/-internals/owner';
import {
  executeCountQuery,
  executeQuery,
  sparqlEscapeString,
  sparqlEscapeUri,
  type BindingObject,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';
import { type Environment } from 'frontend-gelinkt-notuleren/config/environment';
import type SessionService from './gn-session';
import type Store from './gn-store';

export interface Template {
  uri: string;
  title: string;
  body: string | null;
  contexts: string[];
  disabledInContexts: string[];
  loadBody?: () => Promise<void>;
}
// @ts-expect-error This gives a useful type but doesn't match the type constraints somehow...
type TemplateBindings = Omit<BindingObject<Template>, 'uri'> & {
  template: { value: string };
  fileId: { value: string };
};

export default class TemplateFetcher extends Service {
  @service declare session: SessionService;
  @service declare store: Store;

  fetchByTemplateName = async ({
    name,
    abortSignal,
  }: {
    name: string;
    abortSignal?: AbortSignal;
  }) => {
    // TODO resolveRegistration is an internal API, we should migrate away from it as it is likely
    // to disappear
    const config = (
      getOwner(this) as InternalOwner | undefined
    )?.resolveRegistration('config:environment') as Environment;
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
      const json = (await response.json()) as {
        results: { bindings: TemplateBindings[] };
      };
      const bindings = json.results.bindings;
      const templates = bindings.map(this.bindingToTemplate(fileEndpoint));
      return templates[0];
    } else {
      return null;
    }
  };

  // TODO This is unused. Remove it?
  fetchByUri = async ({
    uri,
    abortSignal,
  }: {
    uri: string;
    abortSignal?: AbortSignal;
  }) => {
    // TODO resolveRegistration is an internal API, we should migrate away from it as it is likely
    // to disappear
    const config = (
      getOwner(this) as InternalOwner | undefined
    )?.resolveRegistration('config:environment') as Environment;
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
      const json = (await response.json()) as {
        results: { bindings: TemplateBindings[] };
      };
      const bindings = json.results.bindings;
      const templates = bindings.map((binding) =>
        this.bindingToTemplate(fileEndpoint)({
          ...binding,
          template: { value: uri },
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
    }: {
      templateType: string;
      titleFilter?: string;
      pagination?: { pageSize: number; pageNumber: number };
      favourites?: string[];
      abortSignal?: AbortSignal;
    }) => {
      // TODO resolveRegistration is an internal API, we should migrate away from it as it is likely
      // to disappear
      const config = (
        getOwner(this) as InternalOwner | undefined
      )?.resolveRegistration('config:environment') as Environment;
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
        executeQuery<TemplateBindings>({
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

  queryToFormBody(sparqlQuery: string): BodyInit {
    const details = {
      query: sparqlQuery,
      format: 'application/json',
    };
    const formBody = [];
    for (const property in details) {
      const encodedKey = encodeURIComponent(property);
      const encodedValue = encodeURIComponent(
        details[property as keyof typeof details],
      );
      formBody.push(encodedKey + '=' + encodedValue);
    }
    return formBody.join('&');
  }
  bindingToTemplate(fileEndpoint: string) {
    return (binding: TemplateBindings): Template => {
      const template: Template = {
        uri: binding.template.value,
        title: binding.title.value,
        loadBody: async function () {
          const response = await fetch(
            `${fileEndpoint}/${binding.fileId.value}/download`,
          );
          template.body = await response.text();
        },
        body: null,
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

  async sendQuery(
    endpoint: string,
    sparqlQuery: string,
    abortSignal?: AbortSignal,
  ): Promise<Response> {
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
