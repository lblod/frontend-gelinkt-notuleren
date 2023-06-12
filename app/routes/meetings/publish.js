import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsPublishRoute extends Route {
  @service store;

  async model(params) {
    const zitting = await this.store.findRecord('zitting', params.id, {
      include: 'aanwezigen-bij-start,agendapunten,secretaris,voorzitter',
    });
    zitting.agendapunten = (await zitting.agendapunten).sortBy('position');
    return zitting;
  }
}
