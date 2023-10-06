import RSVP from 'rsvp';
import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RegulatoryStatementsEditRoute extends Route {
  @service currentSession;
  @service store;
  @service router;
  @service standardTemplate;

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
      { include: 'status' },
    );
    const standardTemplates =
      await this.standardTemplate.fetchTemplates.perform();
    const currentVersion = await container.get('currentVersion');
    return RSVP.hash({
      documentContainer: container,
      editorDocument: currentVersion,
      standardTemplates,
    });
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.uploading = false;
    controller._editorDocument = null;
  }
}
