import Model, { attr, hasMany } from '@ember-data/model';

export default class ConceptModel extends Model {
  @attr uri;
  @attr label;

  @hasMany('concept-scheme', { inverse: 'concepts' }) conceptSchemes;
  @hasMany('concept-scheme', { inverse: 'topConcepts' }) topConceptSchemes;
}
