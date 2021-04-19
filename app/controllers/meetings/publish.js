import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

export default class MeetingsPublishController extends Controller {
  @service currentSession;
}
