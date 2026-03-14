import Route from '@ember/routing/route';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsEditAgendapointRoute from '../agendapoint';

export default class MeetingsDownloadCopyRoute extends Route {
  model() {
    const { documentContainer, editorDocument } = this.modelFor(
      'meetings.edit.agendapoint',
    ) as ModelFrom<MeetingsEditAgendapointRoute>;
    return { container: documentContainer, document: editorDocument };
  }
}
