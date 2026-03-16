import Route from '@ember/routing/route';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type AgendapointsRoute from '../agendapoints';

export default class MeetingsDownloadCopyRoute extends Route {
  model() {
    const { documentContainer, editorDocument } = this.modelFor(
      'agendapoints',
    ) as ModelFrom<AgendapointsRoute>;
    return { container: documentContainer, document: editorDocument };
  }
}
