import Controller from '@ember/controller';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class MeetingsNewController extends Controller {
  @action
  async goToEditRoute(zitting) {
    this.transitionToRoute('meetings.edit', zitting.id);
  }
}
