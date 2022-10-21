import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { TRASH_CONCEPT_STATUS } from '../../utils/constants';
import { tracked } from '@glimmer/tracking';

export default class InboxTrashController extends Controller {
  @service currentSession;
  @service store;
  @service router;
  @tracked debounceTime = 2000;
  @tracked page = 0;
  @tracked pageSize = 20;

  @action
  async moveToConcepts(documents) {
    const conceptStatus = await this.store.findRecord(
      'concept',
      TRASH_CONCEPT_STATUS
    );
    for (const document of documents) {
      document.status = conceptStatus;
      await document.save();
    }
    this.router.transitionTo('inbox.agendapoints');
  }
}
