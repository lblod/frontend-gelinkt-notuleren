import Route from '@ember/routing/route';
import type RouterService from '@ember/routing/router-service';
import { service } from '@ember/service';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';

export default class MeetingsEditOutroRoute extends Route {
  @service declare currentSession: CurrentSessionService;
  @service declare router: RouterService;

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.transitionTo('meetings.edit');
    }
  }
}
