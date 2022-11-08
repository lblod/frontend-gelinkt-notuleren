import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AgendapointsEditRoute extends Route {
  @service currentSession;
  @service router;

  queryParams = {
    returnToMeeting: { refreshModel: true },
  };

  beforeModel(transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to.params?.id;
      this.router.transitionTo('agendapoints.show', id);
      return;
    }
  }

  async model(params) {
    const { documentContainer } = this.modelFor('agendapoints');
    return {
      documentContainer,
      editorDocument: await documentContainer.get('currentVersion'),
      returnToMeeting: params.returnToMeeting,
    };
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.uploading = false;
    controller._editorDocument = null;
  }
}
