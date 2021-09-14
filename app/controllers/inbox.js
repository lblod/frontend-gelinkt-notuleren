import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class InboxController extends Controller {
  @service currentSession; //used in template
  @service features;
  @service session;

  get acmSwitchEnabled() {
    return this.features.isEnabled('acmidm-switch');
  }

  @action
  logout() {
    this.session.invalidate();
  }
}
