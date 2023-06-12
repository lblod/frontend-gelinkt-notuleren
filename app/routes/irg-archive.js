import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class IrgArchiveRoute extends Route {
  @service session;
  @service features;

  beforeModel(transition) {
    this.session.requireAuthentication(transition, 'login');
  }
}
