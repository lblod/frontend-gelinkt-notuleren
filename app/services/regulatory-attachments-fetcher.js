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
      PREFIX gn: <http://www.geonames.org/ontology#>
      PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      PREFIX mu: <http://mu.semte.ch/vocabularies/core/>
      PREFIX pav: <http://purl.org/pav/>
      PREFIX dct: <http://purl.org/dc/terms/>
      PREFIX schema: <http://schema.org/>
      PREFIX gn: <http://data.lblod.info/vocabularies/gelinktnotuleren/>
      select distinct * where {
        ?publishedContainer a gn:ReglementaireBijlageTemplate;
          mu:uuid ?uuid;
          pav:hasCurrentVersion ?container.
        ?container dct:title ?title;
          mu:uuid ?fileId.
        OPTIONAL { 
          ?container schema:validThrough ?validThrough.
        }
        FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
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
        title: binding.title.value,
        reload: async (template) => {
          const response = await fetch(
            `${config.regulatoryStatementFileEndpoint}/${binding.fileId.value}/download`
          );
          template.body = await response.text();
        },
      }));
      return templates;
    } else {
      return [];
    }
  }
}
