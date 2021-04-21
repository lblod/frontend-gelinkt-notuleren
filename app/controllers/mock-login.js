import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { timeout } from 'ember-concurrency';
import { task, restartableTask } from 'ember-concurrency-decorators';

export default class MockLoginController extends Controller {
  queryParams = ['gemeente', 'page'];
  @tracked gemeente = '';
  @tracked page = 0;
  @tracked size = 10;

  @task
  * queryStore() {
    const filter = { provider: 'https://github.com/lblod/mock-login-service' };
    if (this.gemeente)
      filter.gebruiker = { 'achternaam': this.gemeente};
    const accounts = yield this.store.query('account', {
      include: 'gebruiker,gebruiker.bestuurseenheden',
      filter: filter,
      page: { size: this.size, number: this.page },
      sort: 'gebruiker.achternaam'
    });
    return accounts;
  }

  @restartableTask
  * updateSearch(value) {
    yield timeout(500);
    this.page = 0;
    this.gemeente = value;
    this.model = yield this.queryStore.perform();
  }
}
