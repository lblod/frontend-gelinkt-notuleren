import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

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
    let now = new Date();
    return this.store.createRecord('zitting', {
      geplandeStart: now,
      gestartOpTijdstip: now,
    });
  }
}
