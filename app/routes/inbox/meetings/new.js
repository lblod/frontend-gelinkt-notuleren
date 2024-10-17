import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxMeetingsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.meetings');
    }
  }

  model() {
    return this.createCommonMeeting();
  }

  async createCommonMeeting() {
    let now = new Date();
    return this.store.createRecord('zitting', {
      geplandeStart: now,
      gestartOpTijdstip: now,
    });
  }
}
