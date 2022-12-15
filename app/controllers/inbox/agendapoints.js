import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';

export default class InboxDraftDecisionsController extends Controller {
  @tracked page = 0;
  @tracked pageSize = 20;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 2000;

  @service currentSession;
  @service router;
  sort = '-current-version.updated-on';

  updateFilter = task({ restartable: true }, async (event) => {
    const input = event.target.value;
    this.searchValue = input;
    await timeout(this.debounceTime);
    this.filter = this.searchValue;
    this.page = 0;
  });

  @action
  openNewDocument() {
    this.router.transitionTo('agendapoints.new');
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
