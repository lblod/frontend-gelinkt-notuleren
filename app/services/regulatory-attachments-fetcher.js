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
      select distinct * where {
        ?reglement ext:publishedVersion ?publishedContainer .
        ?publishedContainer mu:uuid ?uuid.
        ?reglement ext:hasDocumentContainer ?container.
        ?container pav:hasCurrentVersion ?version.
        ?version dct:title ?title.
      } 
    `;
    const details = {
      query: sparqlQuery,
      format: 'application/json',
    };
    var formBody = [];
    for (var property in details) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(details[property]);
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
