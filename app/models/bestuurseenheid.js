import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  uri: attr(),
  naam: attr()
});
