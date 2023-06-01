import { service } from '@ember/service';
import Route from '@ember/routing/route';
import { warn } from '@ember/debug';

export default class ImportEditRoute extends Route {
  queryParams = {
    target: { refreshModel: true },
  };

  @service importRdfaSnippet;
  @service store;
  @service router;

  async beforeModel(transition) {
    await this.importRdfaSnippet.downloadSnippet(transition.to.queryParams);

    const documentContainerUri = transition.to.queryParams.target;

    if (documentContainerUri) {
      const documentContainers = await this.store.query('document-container', {
        'filter[:uri:]': documentContainerUri,
        page: { size: 1 },
      });

      if (documentContainers.length) {
        const documentContainer = documentContainers.firstObject;
        this.router.transitionTo('agendapoints.edit', documentContainer.id);
      } else {
        warn(
          `No document container found with URI '${documentContainerUri}' to import snippet in. Redirecting to inbox.`,
          { id: 'document-container.not-found' }
        );
        this.router.transitionTo('inbox');
      }
    } else {
      warn(
        `No target document container specified to import snippet in. Redirecting to inbox.`,
        { id: 'document-container.no-target' }
      );
      this.router.transitionTo('inbox');
    }
  }
}
