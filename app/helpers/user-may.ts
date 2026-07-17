import Helper from '@ember/component/helper';
import { service } from '@ember/service';
import type { Permission } from 'frontend-gelinkt-notuleren/config/permissions';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';

export default class extends Helper {
  @service declare currentSession: CurrentSessionService;

  compute([permission]: [Permission]) {
    return this.currentSession.may(permission);
  }
}
