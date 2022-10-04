import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { getOwner } from '@ember/application';

export default class RegulatoryAttachmentsFetcher extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked roles = [];

  @task
  *fetch() {
    const config = getOwner(this).resolveRegistration('config:environment');
    const sparqlQuery = `
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX pav: <http://purl.org/pav/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX schema: <http://schema.org/>
      select distinct * where {
        ?publishedContainer a ext:PublishedRegulatoryAttachmentContainer;
          mu:uuid ?uuid;
          ext:currentVersion ?container.
        ?container dct:title ?title.
        ?reglement ext:publishedVersion ?publishedContainer.
        OPTIONAL { 
          ?reglement schema:validThrough ?validThrough.
        }
        FILTER( ! BOUND(?validThrough) || ?validThrough < NOW()) 
      }
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
    const response = yield fetch(config.regulatoryStatementEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      },
      body: formBody,
    });
    if (response.status === 200) {
      const json = yield response.json();
      const bindings = json.results.bindings;
      const templates = bindings.map((binding) => ({
        container: binding.container.value,
        title: binding.title.value,
        reload: async (template) => {
          const response = await fetch(
            `${config.regulatoryStatementPreviewEndpoint}/${binding.uuid.value}`
          );
          const json = await response.json();
          template.body = json.content;
        },
      }));
      return templates;
    } else {
      return [];
    }
  }
}
