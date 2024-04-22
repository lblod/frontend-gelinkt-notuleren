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
      const templates = bindings.map((binding) => {
        return {
          title: binding.title.value,
          loadBody: async function () {
            const response = await fetch(
              `${config.regulatoryStatementFileEndpoint}/${binding.fileId.value}/download`,
            );
            this.body = await response.text();
          },
          contexts: binding.contexts.value.split('|'),
          disabledInContexts: binding.disabledInContexts.value.split('|'),
        };
      });
      return templates;
    } else {
      return [];
    }
  });
}
