import Controller from '@ember/controller';
import { action } from "@ember/object";

export default class MeetingsNewController extends Controller {
  @action
  async goToEditRoute(zitting) {
    this.transitionToRoute('meetings.edit', zitting.id);
  }
}
