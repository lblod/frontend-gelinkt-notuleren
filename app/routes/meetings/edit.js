import Route from '@ember/routing/route';

export default class MeetingsEditRoute extends Route {
  async model(params) {
    const zitting = await this.store.findRecord('zitting', params.id);
    return {
      plannedStart: zitting.geplandeStart,
      startedAt: zitting.gestartOpTijdstip,
      finishedAt: zitting.geeindigdOpTijdstip,
      location: zitting.opLocatie,
      id: params.id
    };
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.id = model.id;
  }
}
