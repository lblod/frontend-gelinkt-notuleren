import DS from 'ember-data';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default DS.Model.extend({
  className: attr(),
  message: attr(),
  specificInformation: attr(),
  datetime: attr(),
  resource: attr(),
  logSource: belongsTo('log-source', { inverse: null }),
  logLevel: belongsTo('log-level', { inverse: null }),
  statusCode: belongsTo('status-code', { inverse: null })
});