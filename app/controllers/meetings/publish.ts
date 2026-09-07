import { service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type SessionService from 'frontend-gelinkt-notuleren/services/gn-session';

export default class MeetingsPublishController extends Controller {
  @service declare currentSession: CurrentSessionService;
  @service declare session: SessionService;

  @action logout() {
    void this.session.invalidate();
  }
}
