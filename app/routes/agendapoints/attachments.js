import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AgendapointsAttachmentsRoute extends Route {
  @service documentService;

  async model() {
    const { documentContainer, editorDocument } = this.modelFor('agendapoints');
    const decisions = this.documentService.getDecisions(editorDocument);
    return {
      documentContainer,
      editorDocument,
      decisions,
    };
  }
}
