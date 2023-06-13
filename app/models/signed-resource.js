import Model, { attr, belongsTo } from '@ember-data/model';

export default class SignedResourceModel extends Model {
  @attr content;
  @attr hashValue;
  @attr('boolean', { defaultValue: false }) deleted;
  @attr('datetime') createdOn;

  @belongsTo('blockchain-status', { inverse: null }) status;
  @belongsTo('gebruiker', { inverse: null }) gebruiker;
  @belongsTo('agenda', { inverse: 'signedResources' }) agenda;
  @belongsTo('versioned-besluiten-lijst', { inverse: 'signedResources' })
  versionedBesluitenLijst;
  @belongsTo('versioned-behandeling', { inverse: 'signedResources' })
  versionedBehandeling;
  @belongsTo('versioned-notulen', { inverse: 'signedResources' })
  versionedNotulen;
}
