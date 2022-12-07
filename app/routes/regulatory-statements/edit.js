import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class RegulatoryStatementsEditRoute extends Route {
  @service currentSession;
  @service store;
  @service router;

  beforeModel(transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to.params?.id;
      this.router.transitionTo('regulatory-statements.show', id);
      return;
    }
  }

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.id,
      { include: 'status' }
    );
    const currentVersion = await container.get('currentVersion');
    const revisions = await container.get('revisions');
    const revisionsWithoutCurrentVersion = revisions.filter(
      (document) => document.id !== currentVersion.id
    );
    return RSVP.hash({
      documentContainer: container,
      editorDocument: currentVersion,
      revisions: revisionsWithoutCurrentVersion,
    });
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.uploading = false;
    controller._editorDocument = null;
  }

  @action
  error(error /*, transition */) {
    if (error.errors && error.errors[0].status === '404') {
      this.router.transitionTo('route-not-found');
    } else {
      // Let the route above this handle the error.
      return true;
    }
  }
}
