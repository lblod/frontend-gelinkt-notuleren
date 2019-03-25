import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  content: attr(),
  hashValue: attr(),
  createdOn: attr('datetime'),
  status: belongsTo('blockchain-status'),
  gebruiker: belongsTo('gebruiker'),
  versionedAgenda: belongsTo('versioned-agenda'),
  versionedBesluitenLijst: belongsTo('versioned-besluiten-lijst'),
  versionedNotulen: belongsTo('versioned-notulen')
});
