import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default class InboxController extends Controller {
  @service currentSession;
}
