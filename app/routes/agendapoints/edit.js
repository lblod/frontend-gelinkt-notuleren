import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AgendapointsEditRoute extends Route {
  @service currentSession;
  @service router;
  @service standardTemplate;

  beforeModel(transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to.params?.id;
      this.router.transitionTo('agendapoints.show', id);
      return;
    }
  }

  async model() {
    const { documentContainer, returnToMeeting } =
      this.modelFor('agendapoints');
    const standardTemplates =
      await this.standardTemplate.fetchTemplates.perform();
    return {
      documentContainer,
      editorDocument: await documentContainer.get('currentVersion'),
      returnToMeeting,
      standardTemplates,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.uploading = false;
    controller._editorDocument = null;
  }
}
