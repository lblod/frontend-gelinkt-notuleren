import Model, { attr, hasMany } from '@ember-data/model';

export default class BestuursorgaanClassificatieCodeModel extends Model {
  @attr label;
  @attr scopeNote;
  @attr uri;
  @hasMany('bestuursfunctie-code', { inverse: 'standaardTypeVan' }) standaardType;
  @hasMany('bestuursorgaan', { inverse: null }) isClassificatieVan;

  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  get stringRep() {
    return [
      this.id,
      this.label,
      this.scopeNote,
    ];
  }
}
