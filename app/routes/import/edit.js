import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  queryParams: {
    target: { refreshModel: true }
  },

  importRdfaSnippet: service(),

  async beforeModel(transition){
    await this.importRdfaSnippet.downloadSnippet(transition.to.queryParams);
    if(transition.to.queryParams.target){
      let documentContainer = (await this.store.query('document-container', {'filter[:uri:]': transition.to.queryParams.target})).firstObject;
      if(documentContainer.id){
        this.transitionTo('editor-documents.edit', documentContainer.id);
        return;
      }
    }
    this.transitionTo('inbox');
  }

});
