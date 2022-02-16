import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MeetingsPublishController extends Controller {
  @service currentSession;
  @service features;
  @service session;

  get acmSwitchEnabled() {
    return this.features.isEnabled('acmidm-switch');
  }

  @action logout() {
    this.session.invalidate();
  }
}
