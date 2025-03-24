import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type AccountModel from './account';
import type BestuurseenheidModel from './bestuurseenheid';
import type UserPreferencesModel from './user-preferences';

export default class GebruikerModel extends Model {
  declare [Type]: 'gebruiker';

  @attr voornaam: Option<string>;
  @attr achternaam: Option<string>;
  @attr rijksregisterNummer: Option<string>;

  @hasMany<AccountModel>('account', { inverse: null, async: true })
  declare account: AsyncHasMany<AccountModel>;

  @hasMany<BestuurseenheidModel>('bestuurseenheid', {
    inverse: null,
    async: true,
  })
  declare bestuurseenheden: AsyncHasMany<BestuurseenheidModel>;

  @belongsTo<UserPreferencesModel>('user-preferences', {
    inverse: 'gebruiker',
    async: true,
  })
  declare preferences: AsyncBelongsTo<UserPreferencesModel>;

  // this is only used for mock login afaik
  async group() {
    return (await this.bestuurseenheden)[0];
  }

  get fullName() {
    return `${this.voornaam} ${this.achternaam}`.trim();
  }
}
