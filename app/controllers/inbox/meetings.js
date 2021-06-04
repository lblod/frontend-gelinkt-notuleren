import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { tracked } from '@glimmer/tracking';

export default class InboxMeetingsController extends Controller.extend(DefaultQueryParamsMixin) {
  @service currentSession;
  @tracked sort = '-geplande-start';

  get readOnly(){
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
