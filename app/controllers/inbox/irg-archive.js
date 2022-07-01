import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

export default class InboxIrgArchiveController extends Controller {
  @tracked page = 0;
  @tracked size = 10;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 2000;

  @restartableTask
  *updateFilter(event) {
    const input = event.target.value;
    this.searchValue = input;
    yield timeout(this.debounceTime);
    this.filter = this.searchValue;
    this.page = 0;
  }
}
