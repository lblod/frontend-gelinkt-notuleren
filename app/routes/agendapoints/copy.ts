import Route from '@ember/routing/route';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type AgendapointsRoute from '../agendapoints';

export default class MeetingsDownloadCopyRoute extends Route {
  async model() {
    const { documentContainer } = this.modelFor(
      'agendapoints',
    ) as ModelFrom<AgendapointsRoute>;
    const document = await documentContainer.currentVersion;
    return { container: documentContainer, document };
  }
}
