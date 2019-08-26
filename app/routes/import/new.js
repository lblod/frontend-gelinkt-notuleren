import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  importRdfaSnippet: service(),

  async beforeModel(transition){
    await this.importRdfaSnippet.downloadSnippet(transition.to.queryParams);
    this.transitionTo('inbox');
  }

});
