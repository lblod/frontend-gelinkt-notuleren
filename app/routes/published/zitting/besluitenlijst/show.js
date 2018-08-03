import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('behandeling-van-agendapunt', params.behandeling_id, {
      include: 'besluiten'
    });
  },
  setupController(controller, model) {
    this._super(controller, model);
    controller.set('zitting', this.modelFor('published.zitting'));
  }
});
