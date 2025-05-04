import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type GebruikerModel from './gebruiker';
import type ConceptModel from './concept';

export default class UserPreferenceModel extends Model {
  declare [Type]: 'user-preference';

  @attr('string') value?: string;

  @belongsTo<ConceptModel>('concept', {
    inverse: null,
    async: true,
  })
  declare type: AsyncBelongsTo<ConceptModel>;

  @belongsTo<GebruikerModel>('gebruiker', {
    inverse: null,
    async: true,
  })
  declare gebruiker: AsyncBelongsTo<GebruikerModel>;
}
