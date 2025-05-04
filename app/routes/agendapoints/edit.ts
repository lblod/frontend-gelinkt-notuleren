import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import type Transition from '@ember/routing/transition';
import { service } from '@ember/service';
import type AgendapointsEditController from 'frontend-gelinkt-notuleren/controllers/agendapoints/edit';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type StandardTemplateService from 'frontend-gelinkt-notuleren/services/standard-template';
import type TemplateFetcher from 'frontend-gelinkt-notuleren/services/template-fetcher';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import RSVP from 'rsvp';
import type AgendapointsRoute from '../agendapoints';

export default class AgendapointsEditRoute extends Route {
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;
  @service declare standardTemplate: StandardTemplateService;
  @service declare templateFetcher: TemplateFetcher;

  beforeModel(transition: Transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to?.params?.['id'];
      this.router.transitionTo('agendapoints.show', id);
      return;
    }
  }

  model() {
    const { documentContainer, returnToMeeting } = this.modelFor(
      'agendapoints',
    ) as ModelFrom<AgendapointsRoute>;
    const templates = this.standardTemplate.fetchTemplates.perform();
    return RSVP.hash({
      documentContainer,
      editorDocument: documentContainer.currentVersion,
      returnToMeeting,
      // This does not include dynamic templates as it is only used for the standard template plugin
      templates,
    });
  }

  setupController(
    controller: AgendapointsEditController,
    model: ModelFrom<this>,
  ) {
    super.setupController(controller, model);
    controller._editorDocument = null;
  }
}
