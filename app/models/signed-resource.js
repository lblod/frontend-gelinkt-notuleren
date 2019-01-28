import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  content: attr(),
  createdOn: attr('datetime'),
  status: belongsTo('blockchain-status'),
  gebruiker: belongsTo('gebruiker'),
  versionedAgenda: belongsTo('versioned-agenda')
});
