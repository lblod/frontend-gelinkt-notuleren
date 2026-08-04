import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type SessionService from './gn-session';
import type Store from './gn-store';
import type AccountModel from 'frontend-gelinkt-notuleren/models/account';
import type GebruikerModel from 'frontend-gelinkt-notuleren/models/gebruiker';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';
import type BestuurseenheidClassificatieCodeModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid-classificatie-code';
import {
  findGroupByRole,
  type AuthorizationRole,
  type Permission,
} from 'frontend-gelinkt-notuleren/config/permissions';

export default class CurrentSessionService extends Service {
  @service declare session: SessionService;
  @service declare store: Store;

  @tracked account: Option<AccountModel>;
  @tracked user: Option<GebruikerModel>;
  @tracked group: Option<BestuurseenheidModel>;
  @tracked roles: string[] = [];
  @tracked classificatie: Option<BestuurseenheidClassificatieCodeModel>;

  get canRead() {
    return this.may('read');
  }

  get canWrite() {
    return this.may('write');
  }

  get canPublish() {
    return this.may('publish');
  }

  get canSign() {
    return this.may('sign');
  }

  may(permission: Permission) {
    const permissions = new Set(
      this.roles.flatMap((role) => findGroupByRole(role)?.permissions ?? []),
    );

    return permissions.has(permission);
  }

  async load() {
    if (this.session.isAuthenticated) {
      const accountId =
        this.session.data.authenticated.relationships.account.data.id;
      const groupId =
        this.session.data.authenticated.relationships.group.data.id;
      this.roles = this.session.data.authenticated.data.attributes.roles;
      await Promise.all([
        this.store
          .findRecord<AccountModel>('account', accountId, {
            include: ['gebruiker'],
          })
          .then(async (account) => {
            this.account = account;
            this.user = await account.gebruiker;
          }),
        this.store
          .findRecord<BestuurseenheidModel>('bestuurseenheid', groupId, {
            include: ['classificatie'],
          })
          .then(async (group) => {
            this.group = group;
            this.classificatie = await group.classificatie;
          }),
      ]);
    }
  }

  hasRole(role: AuthorizationRole) {
    return this.roles.includes(role);
  }
}
