import Route from '@ember/routing/route';
import { service } from '@ember/service';
import DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type MeetingsEditAgendapointRoute from '../agendapoint';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';

export default class AgendapointsAttachmentsRoute extends Route {
  @service declare documentService: DocumentService;

  model() {
    const { documentContainer, editorDocument, returnToMeeting } =
      this.modelFor(
        'meetings.edit.agendapoint',
      ) as ModelFrom<MeetingsEditAgendapointRoute>;
    const decisions =
      editorDocument && this.documentService.getDecisions(editorDocument);

    return {
      documentContainer,
      editorDocument,
      decisions,
      returnToMeeting,
    };
  }
}
