import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsDownloadCopyRoute extends Route {
  @service store;
  async model(params) {
    const container = await this.store.findRecord(
      'document-container',
      params.container_id,
      { include: 'current-version' },
    );
    const document = await container.currentVersion;
    return { container, document };
  }
}
