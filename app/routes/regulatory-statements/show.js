import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { service } from '@ember/service';

export default class AgendapointsShowRoute extends Route {
  @service store;

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.id,
      { include: 'status' }
    );
    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion'),
    });
  }
}
