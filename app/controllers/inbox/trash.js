import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';
import { action } from '@ember/object';

const CONCEPT_STATUS = "a1974d071e6a47b69b85313ebdcef9f7";
export default class InboxTrashController extends Controller.extend(DefaultQueryParamsMixin) {
  @service currentSession;
  @service store;

  @action
  async moveToConcepts(documents /*, datatable */) {
    const conceptStatus = await this.store.findRecord('concept', CONCEPT_STATUS);
    for (const document of documents) {
      document.status = conceptStatus;
      await document.save();
    }
    this.transitionToRoute('inbox.agendapoints');
  }
}
