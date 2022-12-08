import Route from '@ember/routing/route';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default class RegulatoryStatementsRevisionsRoute extends Route {
  @service store;

  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.container_id,
      { include: 'status' }
    );

    const currentVersion = await container.get('currentVersion');
    const document = this.store.findRecord(
      'editor-document',
      params.document_id
    );
    return RSVP.hash({
      documentContainer: container,
      editorDocument: document,
      currentVersion: currentVersion,
    });
  }
}
