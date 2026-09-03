import Route from '@ember/routing/route';
import { service } from '@ember/service';
import ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';

export default class MeetingsPublishRoute extends Route {
  @service declare store: Store;

  async model(params: { id: string }) {
    const zitting = await this.store.findRecord<ZittingModel>(
      'zitting',
      params.id,
      {
        include: [
          'aanwezigenBijStart',
          'agendapunten',
          'secretaris',
          'voorzitter',
        ],
      },
    );
    return zitting;
  }
}
