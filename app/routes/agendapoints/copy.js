import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsDownloadCopyRoute extends Route {
  @service store;
  async model(params) {
    const { documentContainer, returnToMeeting } =
      this.modelFor('agendapoints');
    const document = await documentContainer.currentVersion;
    console.log(document);
    console.log(documentContainer);
    return { container: documentContainer, document };
  }
}
