import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class CurrentSessionService extends Service {
  @service session;
  @service store;

  @tracked account;
  @tracked user;
  @tracked group;
  // Ideally this should be part of `group` itself
  // I'm just putting it into the `CurrentSessionService` for the POC,
  // to indicate that this will be the place where we'll be retrieving the logo from
  @tracked groupLogoUrl;
  @tracked roles = [];

  get canRead() {
    return this.hasRole('GelinktNotuleren-lezer');
  }

  get canWrite() {
    return this.hasRole('GelinktNotuleren-schrijver');
  }

  get canPublish() {
    return this.hasRole('GelinktNotuleren-publiceerder');
  }

  get canSign() {
    return this.hasRole('GelinktNotuleren-ondertekenaar');
  }

  async load() {
    if (this.session.isAuthenticated) {
      let accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this.account = await this.store.findRecord('account', accountId, {
        include: 'gebruiker',
      });
      this.user = await this.account.get('gebruiker');

      let groupId = this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord('bestuurseenheid', groupId, {
        include: 'classificatie',
      });

      this.groupLogoUrl =
        'https://stad.gent/sites/default/files/media/images/logoGent_c100.png';

      this.roles = this.session.data.authenticated.data.attributes.roles;
    }
  }

  hasRole(role) {
    return this.roles.includes(role);
  }
}
