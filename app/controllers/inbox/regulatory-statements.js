import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';

export default class InboxRegulatoryStatementsController extends Controller {
  @tracked page = 0;
  @tracked pageSize = 20;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 1000;

  @service currentSession;
  @service router;
  @service intl;
  sort = '-current-version.updated-on';

  /**
   * @param {InputEvent<HTMLInputElement>} event
   */
  updateFilter = restartableTask(async (event) => {
    this.searchValue = event.target.value;
    await timeout(this.debounceTime);
    this.filter = this.searchValue;
    this.page = 0;
  });

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
