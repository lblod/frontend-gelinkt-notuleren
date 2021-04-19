import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

export default class ImportNewRoute extends Route {
  @service importRdfaSnippet;

  async beforeModel(transition) {
    await this.importRdfaSnippet.downloadSnippet(transition.to.queryParams);
    this.transitionTo('inbox');
  }
}
