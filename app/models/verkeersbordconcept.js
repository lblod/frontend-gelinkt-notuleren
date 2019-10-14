import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  afbeelding: attr(),
  betekenis: attr(),
  verkeersbordcode: attr(),
  beschrijving: attr()
});
