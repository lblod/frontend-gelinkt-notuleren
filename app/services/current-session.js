/* eslint-disable ember/require-computed-property-dependencies */
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { get, computed } from '@ember/object';
import { task, waitForProperty } from 'ember-concurrency';

export default Service.extend({
  session: service('session'),
  store: service('store'),
  async load() {
    if (this.session.isAuthenticated) {
      const session = this.session;
      const account = await this.store.find('account', get(session, 'data.authenticated.relationships.account.data.id'));
      const user = await account.get('gebruiker');
      const group = await this.store.find('bestuurseenheid', get(session, 'data.authenticated.relationships.group.data.id'));
      const roles = await get(session, 'data.authenticated.data.attributes.roles');

      this.set('_account', account);
      this.set('_user', user);
      this.set('_group', group);
      this.set('_roles', roles);

      this.set('canPublish', this.hasRole('GelinktNotuleren-publiceerder'));
      this.set('canSign', this.hasRole('GelinktNotuleren-ondertekenaar'));
    }
  },

  hasRole(role) {
    return this._roles.includes(role);
  },
  waitForIt: task(function * (property) {
    yield waitForProperty(this, property);
    return this.get(property);
  }),
  account: computed('_account', function() {
    return this.waitForIt.perform('_account');
  }),
  user: computed('_user', function() {
    return this.waitForIt.perform('_user');
  }),
  group: computed('_group', function() {
    return this.waitForIt.perform('_group');
  }),
  roles: computed('_roles', function() {
    return this.waitForIt.perform('_roles');
  })
});
