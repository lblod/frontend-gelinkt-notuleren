import Model, { type AsyncHasMany, attr, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type ConceptModel from './concept';

export default class ConceptSchemeModel extends Model {
  declare [Type]: 'concept-scheme';

  @attr uri?: string;
  @attr label?: string;

  @hasMany<ConceptModel>('concept', { inverse: null, async: true })
  declare concepts: AsyncHasMany<ConceptModel>;
  @hasMany<ConceptModel>('concept', { inverse: null, async: true })
  declare topConcepts: AsyncHasMany<ConceptModel>;
}
