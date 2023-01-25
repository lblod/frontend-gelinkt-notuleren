import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
import { action } from '@ember/object';

export default class InboxRegulatoryStatementsController extends Controller {
  @tracked page = 0;
  @tracked pageSize = 20;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 2000;

  @tracked selectedDocument = null;
  @tracked showLinkedAgendapointsModal = false;

  @service currentSession;
  @service router;
  sort = '-current-version.updated-on';

  @restartableTask
  *updateFilter(event) {
    this.searchValue = event.target.value;
    yield timeout(this.debounceTime);
    this.filter = this.searchValue;
    this.page = 0;
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }

  @action
  showLinkedAgendapoints(document) {
    this.selectedDocument = document;
    this.showLinkedAgendapointsModal = true;
  }

  @action
  closeLinkedAgendapointsModal() {
    this.showLinkedAgendapointsModal = false;
  }
}
