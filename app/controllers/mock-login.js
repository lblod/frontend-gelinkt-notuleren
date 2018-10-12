import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';

export default Controller.extend({
  queryParams: ['gemeente', 'page'],
  gemeente: '',
  page: 0,
  size: 10,

  queryStore: task(function * () {
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
  }),
  updateSearch: task(function * (value) {
    yield timeout(500);
    this.set('page',0);
    this.set('gemeente', value);
    const model = yield this.queryStore.perform();
    this.set('model', model);
  }).restartable()
});
