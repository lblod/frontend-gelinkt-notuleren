import Model, { attr, hasMany, type AsyncHasMany } from '@ember-data/model';
import type ConceptSchemeModel from './concept-scheme';
import type { Type } from '@warp-drive/core-types/symbols';

export default class ConceptModel extends Model {
  declare [Type]: 'concept';

  @attr uri?: string;
  @attr label?: string;
  @attr note?: string;
  @attr notation?: string;

  @hasMany('concept-scheme', { inverse: null, async: true })
  declare conceptSchemes: AsyncHasMany<ConceptSchemeModel>;
  @hasMany('concept-scheme', { inverse: null, async: true })
  declare topConceptSchemes: AsyncHasMany<ConceptSchemeModel>;
}
