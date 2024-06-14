import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class RechtstreekseVerkiezingModel extends Model {
  @attr uri;
  @attr('date') datum;
  @attr('date') geldigheid;

  @belongsTo('bestuursorgaan', {
    inverse: 'wordtSamengesteldDoor',
    async: true,
  })
  steltSamen;

  @hasMany('kandidatenlijst', {
    inverse: 'rechtstreekseVerkiezing',
    async: true,
  })
  heeftLijst;
}
