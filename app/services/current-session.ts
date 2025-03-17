import Service, { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type SessionService from './session';
import type Store from './store';
import type AccountModel from 'frontend-gelinkt-notuleren/models/account';
import type GebruikerModel from 'frontend-gelinkt-notuleren/models/gebruiker';
import type BestuurseenheidModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid';
import type BestuurseenheidClassificatieCodeModel from 'frontend-gelinkt-notuleren/models/bestuurseenheid-classificatie-code';

export default class CurrentSessionService extends Service {
  @service declare session: SessionService;
  @service declare store: Store;

  @tracked account?: AccountModel;
  @tracked user?: Option<GebruikerModel>;
  @tracked group?: BestuurseenheidModel;
  @tracked roles: string[] = [];
  @tracked classificatie?: BestuurseenheidClassificatieCodeModel;

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
      const accountId =
        this.session.data.authenticated.relationships.account.data.id;
      this.account = await this.store.findRecord<AccountModel>(
        'account',
        accountId,
        {
          include: ['gebruiker'],
        },
      );
      this.user = await this.account.get('gebruiker');

      const groupId =
        this.session.data.authenticated.relationships.group.data.id;
      this.group = await this.store.findRecord<BestuurseenheidModel>(
        'bestuurseenheid',
        groupId,
        {
          include: ['classificatie'],
        },
      );
      this.classificatie = (await this.group
        .classificatie) as BestuurseenheidClassificatieCodeModel;
      this.roles = this.session.data.authenticated.data.attributes.roles;
    }
  }

  hasRole(role: string) {
    return this.roles.includes(role);
  }
}
