import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class AgendapointsShowRoute extends Route {
  @service store;

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.container_id,
      { include: 'status' }
    );
    const revisions = await container.get('revisions');
    const document = revisions.find(
      (document) => document.id === params.document_id
    );
    return RSVP.hash({
      documentContainer: container,
      editorDocument: document,
    });
  }
}
