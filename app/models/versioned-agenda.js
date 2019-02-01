import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { hasMany } from 'ember-data/relationships';

export default Model.extend({
  state: attr(),
  content: attr(),
  signedResources: hasMany('signed-resource'),
  pulishedResource: attr('has-one'),
  editorDocument: attr('has-one')
});
