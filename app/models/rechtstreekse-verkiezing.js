import Model from 'ember-data/model';
import { collect } from '@ember/object/computed';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  stringRep: collect.apply(this,['id', 'datum', 'geldigheid']),

  datum: attr('date'),
  geldigheid: attr('date'),
  steltSamen: belongsTo('bestuursorgaan', { inverse: 'wordtSamengesteldDoor' }),
  heeftLijst: hasMany('kandidatenlijst', { inverse: 'rechtstreekseVerkiezing' })
});
