import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class RegulatoryStatementsCopyRoute extends Route {
  @service store;
  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.id,
      { include: 'status' },
    );
    const document = await container.get('currentVersion');
    return { container, document };
  }
}
