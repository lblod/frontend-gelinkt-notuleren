import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsPublishUittrekselsShowRoute extends Route {
  @service store;

  async model(params) {
    return this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id,
      { include: 'onderwerp.zitting' }
    );
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.loadExtract.perform();
  }
}
