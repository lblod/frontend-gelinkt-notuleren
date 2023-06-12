import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AgendapointsAttachmentsRoute extends Route {
  @service documentService;

  async model() {
    const { documentContainer, returnToMeeting } =
      this.modelFor('agendapoints');
    const editorDocument = await documentContainer.currentVersion;
    const decisions = this.documentService.getDecisions(editorDocument);
    return {
      documentContainer,
      editorDocument,
      decisions,
      returnToMeeting,
    };
  }
}
