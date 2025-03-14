import Route from '@ember/routing/route';
import { service } from '@ember/service';
import RSVP from 'rsvp';

export default class AgendapointsEditRoute extends Route {
  @service currentSession;
  @service router;
  @service standardTemplate;
  @service templateFetcher;

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
    const templates = this.standardTemplate.fetchTemplates.perform();

    return RSVP.hash({
      documentContainer,
      editorDocument: documentContainer.currentVersion,
      returnToMeeting,
      // This does not include dynamic templates as it is only used for the standard template plugin
      templates,
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.uploading = false;
    controller._editorDocument = null;
  }
}
