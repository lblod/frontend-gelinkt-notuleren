import Route from '@ember/routing/route';

export default class MeetingsPublishUittrekselsShowRoute extends Route {
  async model(params) {
    console.log(params);
    return this.store.findRecord('behandeling-van-agendapunt', params.treatment_id, { include: 'onderwerp.zitting'});
  }

  setupController(controller) {
    super.setupController(...arguments);
    controller.loadExtract.perform();
  }
}
