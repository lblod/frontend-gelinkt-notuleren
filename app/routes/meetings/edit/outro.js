import Route from '@ember/routing/route';

export default class MeetingsEditOutroRoute extends Route {
  setupController(controller, model, transition) {
    super.setupController(controller, model, transition);
    controller.addExitHandler();
  }

  resetController(controller, isExiting, transition) {
    controller.removeExitHandler();
    super.resetController(controller, isExiting, transition);
  }
}
