import Route from '@ember/routing/route';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsEditAgendapointRoute from '../agendapoint';

export default class MeetingsDownloadCopyRoute extends Route {
  async model() {
    const { documentContainer } = this.modelFor(
      'meetings.edit.agendapoint',
    ) as ModelFrom<MeetingsEditAgendapointRoute>;
    const document = await documentContainer.currentVersion;
    return { container: documentContainer, document };
  }
}
