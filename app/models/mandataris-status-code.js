import Model, { attr } from '@ember-data/model';

export default Model.extend({
  uri: attr(),
  label: attr()
});
