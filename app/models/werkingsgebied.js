import Model, { attr, hasMany } from '@ember-data/model';

export default class WerkingsgebiedModel extends Model {
  @attr naam;
  @attr niveau;

  @hasMany('bestuurseenheid', { inverse: 'werkingsgebied' }) bestuurseenheid;
}
