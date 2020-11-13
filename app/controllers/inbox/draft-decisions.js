import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { inject as service } from '@ember/service';
import {action} from '@ember/object';
import agenda from '../documents/show/publish/agenda';

export default class InboxDraftDecisionsController extends Controller.extend(DefaultQueryParamsMixin) {
  @service currentSession;
  @service store;
  sort='-current-version.updated-on';

  @action
  openNewDocument() {
    this.transitionToRoute('draft-decisions.new');
  }

  @action
  async openZitting(documentContainer){

    let behandeling=await this.store.query("behandeling-van-agendapunt", {"filter[document-container][:id:]": documentContainer.id });
    behandeling=behandeling.firstObject;

    let agendapunt=await this.store.query("agendapunt", {"filter[behandeling][:id:]": behandeling.id });
    agendapunt=agendapunt.firstObject;

    let zitting=await this.store.query("zitting", {"filter[agendapunten][:id:]": agendapunt.id });
    zitting=zitting.firstObject;

    this.transitionToRoute('meetings.edit', zitting.id);
  }
}
