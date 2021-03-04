import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  datum: attr('date'),
  geldigheid: attr('date'),
  steltSamen: belongsTo('bestuursorgaan', { inverse: 'wordtSamengesteldDoor' }),
  heeftLijst: hasMany('kandidatenlijst', { inverse: 'rechtstreekseVerkiezing' })
});
