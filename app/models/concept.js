import Model, { attr, hasMany }from '@ember-data/model';

export default class ConceptModel extends Model {
  @attr uri
  @attr label

  @hasMany("concept-scheme", { inverse: null }) conceptSchemes
  @hasMany("concept-scheme", { inverse: null }) topConceptSchemes
}
