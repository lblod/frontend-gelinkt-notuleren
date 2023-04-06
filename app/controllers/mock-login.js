import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class MockLoginController extends Controller {
  queryParams = ['gemeente', 'page'];
  @service store;
  @tracked gemeente = '';
  @tracked page = 0;
  @tracked size = 10;

  queryStore = task(async () => {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.gemeente) filter.gebruiker = { achternaam: this.gemeente };
    const accounts = await this.store.query('account', {
      include: 'gebruiker,gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam',
    });
    return accounts;
  });

  updateSearch = restartableTask(async (value) => {
    await timeout(500);
    this.page = 0;
    this.gemeente = value;
    this.model = await this.queryStore.perform();
  });
}
