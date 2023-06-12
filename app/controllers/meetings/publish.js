import { service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MeetingsPublishController extends Controller {
  @service currentSession;
  @service session;

  @action logout() {
    this.session.invalidate();
  }
}
