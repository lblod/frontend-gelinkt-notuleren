import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsEditRoute extends Route {
  @service store;

  async model(params) {
    const zitting = await this.store.findRecord('zitting', params.id, {
      include: 'bestuursorgaan,secretaris,voorzitter,intermissions',
    });
    return zitting;
  }
}
