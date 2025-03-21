import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import { type Type } from '@warp-drive/core-types/symbols';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type StringArrayTransform from 'frontend-gelinkt-notuleren/transforms/string-array';
import type GebruikerModel from './gebruiker';

export default class UserPreferencesModel extends Model {
  declare [Type]: 'user-preferences';

  @attr<StringArrayTransform>('string-array') favouriteTemplates: Option<
    string[]
  >;

  @belongsTo<GebruikerModel>('gebruiker', {
    inverse: 'preferences',
    async: true,
  })
  declare gebruiker: AsyncBelongsTo<GebruikerModel>;
}
