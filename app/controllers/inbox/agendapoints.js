import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { inject as service } from '@ember/service';
import {action} from '@ember/object';

export default class InboxDraftDecisionsController extends Controller.extend(DefaultQueryParamsMixin) {
  @service currentSession;
  @service store;
  sort='-current-version.updated-on';

  @action
  openNewDocument() {
    this.transitionToRoute('agendapoints.new');
  }
  get readOnly(){
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
