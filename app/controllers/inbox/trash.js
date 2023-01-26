import { inject as service } from '@ember/service';
import Controller from '@ember/controller';
import { action } from '@ember/object';
import { DRAFT_STATUS_ID } from '../../utils/constants';
import { tracked } from '@glimmer/tracking';

export default class InboxTrashController extends Controller {
  @tracked page = 0;
  @tracked pageSize = 20;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 2000;

  @service currentSession;
  @service router;
  @service intl;

  @action
  async moveToConcepts(documents) {
    const conceptStatus = await this.store.findRecord(
      'concept',
      DRAFT_STATUS_ID
    );
    for (const document of documents) {
      document.status = conceptStatus;
      await document.save();
    }
    this.router.transitionTo('inbox.agendapoints');
  }
}
