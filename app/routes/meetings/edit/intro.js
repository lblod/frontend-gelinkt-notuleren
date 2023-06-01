import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsEditIntroRoute extends Route {
  @service currentSession;
  @service router;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.transitionTo('meetings.edit');
    }
  }
}
