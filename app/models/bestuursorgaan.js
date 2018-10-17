import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  classificatie: attr(),
  naam: attr(),
  uri: attr()
  // bestuurseenheid: belongsTo('bestuurseenheid', {inverse: 'bestuursorgaan'})
});
