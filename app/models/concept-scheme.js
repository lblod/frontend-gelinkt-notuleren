import Model, { attr, hasMany }from '@ember-data/model';

export default class ConceptSchemeModel extends Model {
  @attr uri
  @attr label

  @hasMany('concept', { inverse: null }) concepts
  @hasMany('concept', { inverse: null }) topConcepts
}
