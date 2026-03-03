import Route from '@ember/routing/route';
import { service } from '@ember/service';
import DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type AgendapointsRoute from '../agendapoints';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type Transition from '@ember/routing/transition';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type RouterService from '@ember/routing/router-service';

export default class AgendapointsAttachmentsRoute extends Route {
  @service declare documentService: DocumentService;
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;

  beforeModel(transition: Transition) {
    if (!this.currentSession.canWrite) {
      const id = transition.to?.parent?.params?.['id'];
      this.router.transitionTo('agendapoints.show', id);
      return;
    }
  }

  async model() {
    const { documentContainer } = this.modelFor(
      'agendapoints',
    ) as ModelFrom<AgendapointsRoute>;
    const editorDocument = await documentContainer.currentVersion;
    const decisions =
      editorDocument && this.documentService.getDecisions(editorDocument);
    return {
      documentContainer,
      editorDocument,
      decisions,
    };
  }
}
