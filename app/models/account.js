import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  voId: attr(),
  provider: attr(),
  gebruiker: belongsTo('gebruiker', { inverse: null})
});
