import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';

export default class InboxMeetingsController extends Route {
  @service store;
  @service currentSession;
  @tracked sort = '-geplande-start';

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
