import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';

export default class InboxIrgArchiveController extends Controller {
  @tracked page = 0;
  @tracked size = 10;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 2000;
  @tracked debouncing = false;

  @task
  *updateFilter(event) {
    const input = event.target.value;
    this.searchValue = input;
    if (!this.debouncing) {
      this.isDebouncing = true;
      yield this.timeout(this.debounceTime);
      this.filter = this.searchValue;
      this.page = 0;
      this.debouncing = false;
    }
  }

  timeout(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
