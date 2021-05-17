import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsNewRoute extends Route {
  @service currentSession;
  beforeModel() {
    if(!this.currentSession.canWrite) {
      this.transitionTo('inbox.meetings');
    }
  }

  model(){
    const now = new Date();
    return this.store.createRecord('zitting', {
      geplandeStart: now,
      gestartOpTijdstip: now,
      intro: "",
      outro: ""
    });
  }
}
