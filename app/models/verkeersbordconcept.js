import Model, { attr } from '@ember-data/model';

export default Model.extend({
  afbeelding: attr(),
  betekenis: attr(),
  verkeersbordcode: attr(),
  beschrijving: attr()
});
