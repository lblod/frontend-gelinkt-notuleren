import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentSessionService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  @tracked roles = [];

  get canPublish() {
    return this.hasRole('GelinktNotuleren-publiceerder');
  }

  get canSign() {
    return this.hasRole('GelinktNotuleren-ondertekenaar');
  }

  async load() {
    if (this.session.isAuthenticated) {
      let accountId = this.session.data.authenticated.relationships.account.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'gebruiker'
      });
      this.user = await this.account.get('gebruiker');

      let groupId = this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord('bestuurseenheid', groupId, {
        include: 'classificatie'
      });

      this.roles = this.session.data.authenticated.data.attributes.roles;
    }
  }

  hasRole(role) {
    return this.roles.includes(role);
  }
}
