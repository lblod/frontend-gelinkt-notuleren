import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';

export default class InboxMeetingsController extends Controller {
  @service store;
  @service currentSession;

  sort = '-geplande-start';
  @tracked debounceTime = 2000;
  @tracked page = 0;
  @tracked pageSize = 20;

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
