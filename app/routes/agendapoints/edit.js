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
    const standardTemplatesPromise =
      this.standardTemplate.fetchTemplates.perform();
    const dynamicTemplatesPromise = this.templateFetcher.fetch.perform({
      templateType:
        'http://data.lblod.info/vocabularies/gelinktnotuleren/BesluitTemplate',
    });

    const templatesPromise = Promise.all([
      standardTemplatesPromise,
      dynamicTemplatesPromise,
    ]).then((result) => result.flat());

    return RSVP.hash({
      documentContainer,
      editorDocument: documentContainer.currentVersion,
      returnToMeeting,
      templates: templatesPromise,
    });
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.uploading = false;
    controller._editorDocument = null;
  }
}
