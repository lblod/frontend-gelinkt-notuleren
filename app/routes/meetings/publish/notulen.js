import Route from '@ember/routing/route';

export default class MeetingsPublishNotulenRoute extends Route {
  model() {
    return this.modelFor('meetings.publish');
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.initialize();
  }

  resetController(controller) {
    super.resetController(...arguments);
    controller.resetController();
  }
}
