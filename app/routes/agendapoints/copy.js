import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsDownloadCopyRoute extends Route {
  @service store;
  async model() {
    const { documentContainer } = this.modelFor('agendapoints');
    const document = await documentContainer.currentVersion;
    return { container: documentContainer, document };
  }
}
