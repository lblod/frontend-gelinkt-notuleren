import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { restartableTask, timeout } from 'ember-concurrency';

export default class InboxIrgArchiveController extends Controller {
  @tracked page = 0;
  @tracked size = 10;
  @tracked filter = '';
  @tracked searchValue = this.filter;
  @tracked debounceTime = 1000;

  /**
   * @param {InputEvent<HTMLInputElement>} event
   */
  updateFilter = restartableTask(async (event) => {
    const input = event.target.value;
    this.searchValue = input;
    await timeout(this.debounceTime);
    this.filter = this.searchValue;
    this.page = 0;
  });
}
