import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsDownloadRoute extends Route {
  @service store;
  async model(params) {
    const zitting = await this.store.findRecord('zitting', params.id, {
      include:
        'bestuursorgaan,agendapunten,agendapunten.behandeling,agendapunten.behandeling.document-container',
    });
    return zitting;
  }
}
