import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { warn } from '@ember/debug';

export default Route.extend({
  queryParams: {
    target: { refreshModel: true }
  },

  importRdfaSnippet: service(),

  async beforeModel(transition){
    await this.importRdfaSnippet.downloadSnippet(transition.to.queryParams);

    const documentContainerUri = transition.to.queryParams.target;

    if (documentContainerUri) {
      const documentContainers = await this.store.query('document-container', {
        'filter[:uri:]': documentContainerUri,
        page: { size: 1 }
      });

      if (documentContainers.length){
        const documentContainer = documentContainers.firstObject;
        this.transitionTo('editor-documents.edit', documentContainer.id);
      } else {
        warn(`No document container found with URI '${documentContainerUri}' to import snippet in. Redirecting to inbox.`, { id: 'document-container.not-found' });
        this.transitionTo('inbox');
      }
    } else {
      warn(`No target document container specified to import snippet in. Redirecting to inbox.`, { id: 'document-container.no-target' });
      this.transitionTo('inbox');
    }
  }

});
