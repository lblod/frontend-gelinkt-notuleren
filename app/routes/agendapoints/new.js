import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class AgendapointsNewRoute extends Route {
  @service currentSession;
  beforeModel() {
    if(!this.currentSession.canWrite) {
      this.transitionTo('inbox.agendapoints');
    }
  }

  model() {
    return this.store.createRecord('editor-document');
  }
}
