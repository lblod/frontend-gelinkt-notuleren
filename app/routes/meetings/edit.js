import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsEditRoute extends Route {
  @service store;

  async model(params) {
    const zitting = await this.store.findRecord('zitting', params.id, {
      include:
        'bestuursorgaan,secretaris,voorzitter,intermissions,aanwezigen-bij-start,afwezigen-bij-start',
    });
    return zitting;
  }
}
