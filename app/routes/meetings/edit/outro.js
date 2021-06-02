import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsEditOutroRoute extends Route {
  @service currentSession;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.transitionTo('meetings.edit');
    }
  }
}
