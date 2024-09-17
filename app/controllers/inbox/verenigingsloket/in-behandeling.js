import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { trackedFunction } from 'ember-resources/util/function';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';

const SEARCH_DEBOUNCE_MS = 300;

export default class VerenigingsloketInBehandelingController extends Controller {
  @service verenigingsloket;

  queryParams = ['filter', 'page', 'pageSize', 'sort'];
  @tracked filter;
  @tracked page = 0;
  @tracked pageSize = 10;
  @tracked sort = '-created-on';

  data = trackedFunction(this, async () => {
    // return this.store.query('aanvraag-verenigingsloket', {
    //   filter: {
    //     ':exact:status': 'in-behandeling',
    //     title: this.filter,
    //   },
    //   sort: this.sort,
    //   page: {
    //     number: this.page,
    //     size: this.pageSize,
    //   },
    // });
    const result = await this.verenigingsloket.fetch.perform({
      title: this.filter,
      status: 'in-behandeling',
    });
    return result;
  });

  updateFilter = restartableTask(async (event) => {
    const value = event.target.value;
    await timeout(SEARCH_DEBOUNCE_MS);
    this.filter = value;
  });
}
