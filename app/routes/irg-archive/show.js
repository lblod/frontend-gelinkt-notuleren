import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { service } from '@ember/service';

export default class IrgArchiveShowRoute extends Route {
  @service store;

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.id
    );
    return RSVP.hash({
      documentContainer: container,
      editorDocument: await container.get('currentVersion'),
    });
  }
}
