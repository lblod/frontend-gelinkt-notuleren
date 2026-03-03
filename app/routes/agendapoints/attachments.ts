import Route from '@ember/routing/route';
import { service } from '@ember/service';
import DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type AgendapointsRoute from '../agendapoints';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';

export default class AgendapointsAttachmentsRoute extends Route {
  @service declare documentService: DocumentService;

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
