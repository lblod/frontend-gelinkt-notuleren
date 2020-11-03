import Route from "@ember/routing/route";

export default class MeetingsPublishBesluitenlijstRoute extends Route {
  model() {
    return this.modelFor("meetings.publish");
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.initialize();
  }
}
