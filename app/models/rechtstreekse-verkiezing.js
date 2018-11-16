import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  datum: attr('date'),
  geldigheid: attr('date'),
  steltSamen: belongsTo('bestuursorgaan', { inverse: 'wordtSamengesteldDoor' }),
  heeftLijst: hasMany('kandidatenlijst', { inverse: 'rechtstreekseVerkiezing' })
});
