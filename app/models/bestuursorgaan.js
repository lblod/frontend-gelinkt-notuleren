import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  uri: attr(),
  naam: attr(),
  bindingStart: attr(),
  bindingEinde: attr(),
  bestuurseenheid: belongsTo('bestuurseenheid', { inverse: 'bestuursorganen' }),
  isTijdsspecialisatieVan: belongsTo('bestuursorgaan', { inverse: 'heeftTijdsspecialisaties' }),
  heeftTijdsspecialisaties: hasMany('bestuursorgaan', { inverse: 'isTijdsspecialisatieVan' })
});
