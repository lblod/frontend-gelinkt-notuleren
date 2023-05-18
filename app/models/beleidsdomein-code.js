import Model, { attr, hasMany } from '@ember-data/model';

export default class BeleidsdomeinCodeModel extends Model {
  @attr uri;
  @attr label;
  @attr scopeNote;

  @hasMany('mandataris', { inverse: 'beleidsdomein' }) mandatarissen;
}
