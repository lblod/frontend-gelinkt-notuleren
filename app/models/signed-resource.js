import Model, { attr, belongsTo } from '@ember-data/model';

export default class SignedResourceModel extends Model {
  @attr content;
  @attr hashValue;
  @attr('datetime') createdOn;
  @belongsTo('blockchain-status') status;
  @belongsTo('gebruiker') gebruiker;
  @belongsTo('versioned-agenda') versionedAgenda;
  @belongsTo('versioned-besluiten-lijst') versionedBesluitenLijst;
  @belongsTo('versioned-notulen') versionedNotulen;
}
