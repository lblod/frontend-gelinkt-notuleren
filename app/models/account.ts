import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type GebruikerModel from './gebruiker';

export default class AccountModel extends Model {
  declare [Type]: 'account';

  @attr voId: Option<string>;
  @attr provider: Option<string>;
  @belongsTo<GebruikerModel>('gebruiker', { inverse: null, async: true })
  declare gebruiker: AsyncBelongsTo<GebruikerModel>;
}
