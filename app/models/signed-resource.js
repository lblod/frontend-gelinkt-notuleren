import Model, { attr, belongsTo } from '@ember-data/model';

export default class SignedResourceModel extends Model {
  @attr content;
  @attr hashValue;
  @attr('boolean', { defaultValue: false }) deleted;
  @attr('datetime') createdOn;
  @belongsTo('blockchain-status') status;
  @belongsTo('gebruiker') gebruiker;
  @belongsTo('agenda') agenda;
  @belongsTo('versioned-agenda') versionedAgenda;
  @belongsTo('versioned-behandeling') versionedBehandeling;
  @belongsTo('versioned-besluiten-lijst') versionedBesluitenLijst;
  @belongsTo('versioned-notulen') versionedNotulen;
  @belongsTo('versioned-behandeling', { inverse: 'signedResources' })
  versionedBehandeling;
}
