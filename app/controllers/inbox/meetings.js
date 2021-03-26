import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class InboxMeetingsController extends Controller.extend(DefaultQueryParamsMixin) {
  constructor(...args){
    super(...args);
  }

  @service currentSession;
  @tracked sort = '-geplande-start';

  @action
  openNewDocument() {
    this.transitionToRoute('meetings.new');
  }
}
