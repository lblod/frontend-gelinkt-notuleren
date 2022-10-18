import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';
import { action } from '@ember/object';

export default class InboxTrashController extends Route {
  @service currentSession;
  @service store;
  @service router;

  @action
  async moveToConcepts(documents /*, datatable */) {
    const conceptStatus = await this.store.findRecord(
      'concept',
      'a1974d071e6a47b69b85313ebdcef9f7'
    );
    for (const document of documents) {
      document.status = conceptStatus;
      await document.save();
    }
    this.router.transitionTo('inbox.agendapoints');
  }
}
