import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';

export default class TemplateFetcher extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked roles = [];
  fetch = task(async ({ templateType }) => {
    const config = getOwner(this).resolveRegistration('config:environment');
    const sparqlQuery = `
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX pav: <http://purl.org/pav/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX schema: <http://schema.org/>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      SELECT
        ?container
        ?title
        ?fileId
        (GROUP_CONCAT(?context;SEPARATOR="|") as ?contexts)
        (GROUP_CONCAT(?disabledInContext;SEPARATOR="|") as ?disabledInContexts)
      WHERE {
        ?publishedContainer a <${templateType}>;
          mu:uuid ?uuid;
          pav:hasCurrentVersion ?container.
        ?container dct:title ?title;
          mu:uuid ?fileId.
        OPTIONAL {
          ?container schema:validThrough ?validThrough.
        }
        OPTIONAL {
          ?container ext:context ?context.
        }
        OPTIONAL {
          ?container ext:disabledInContext ?disabledInContext.
        }
        FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
      }
      GROUP BY ?container ?title ?fileId
    `;
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
    const response = await fetch(config.regulatoryStatementEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    });
    if (response.status === 200) {
      const json = await response.json();
      const bindings = json.results.bindings;
      const templates = bindings.map((binding) => ({
        title: binding.title.value,
        loadBody: async function () {
          const response = await fetch(
            `${config.regulatoryStatementFileEndpoint}/${binding.fileId.value}/download`,
          );
          this.body = await response.text();
        },
        contexts: binding.contexts.split('|'),
        disabledInContexts: binding.disabledInContexts.split('|'),
      }));
      return templates;
    } else {
      return [];
    }
  });
}
