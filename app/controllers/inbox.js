import Controller from '@ember/controller';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class InboxController extends Controller {
  @service currentSession; //used in template
  @service session;
  @action
  logout() {
    this.session.invalidate();
  }
}
