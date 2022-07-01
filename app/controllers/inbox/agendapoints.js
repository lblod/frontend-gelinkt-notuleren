import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';

export default class InboxDraftDecisionsController extends Controller {
  @tracked page = 0;
  @tracked size = 10;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 2000;

  @service currentSession;
  @service router;
  sort = '-current-version.updated-on';

  @restartableTask
  *updateFilter(event) {
    const input = event.target.value;
    this.searchValue = input;
    yield timeout(this.debounceTime);
    this.filter = this.searchValue;
    this.page = 0;
  }

  @action
  openNewDocument() {
    this.router.transitionTo('agendapoints.new');
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
