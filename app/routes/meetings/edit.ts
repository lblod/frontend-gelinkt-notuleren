import Route from '@ember/routing/route';
import { service } from '@ember/service';
import Zitting from 'frontend-gelinkt-notuleren/models/zitting';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';

export default class MeetingsEditRoute extends Route {
  @service declare store: StoreService;

  async model(params: { id: string }) {
    const zitting = await this.store.findRecord<Zitting>('zitting', params.id, {
      include: [
        'bestuursorgaan',
        'secretaris',
        'voorzitter',
        'intermissions',
        'aanwezigenBijStart',
        'afwezigenBijStart',
      ],
    });
    return zitting;
  }
}
