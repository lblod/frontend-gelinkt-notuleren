import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  content: attr(),
  hashValue: attr(),
  createdOn: attr('datetime'),
  submissionStatus: attr(),
  status: belongsTo('blockchain-status'),
  gebruiker: belongsTo('gebruiker'),
  versionedAgenda: belongsTo('versioned-agenda'),
  versionedBesluitenLijst: belongsTo('versioned-besluiten-lijst'),
  versionedNotulen: belongsTo('versioned-notulen')
});
