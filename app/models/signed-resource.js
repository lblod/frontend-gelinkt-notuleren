import Model, { attr, belongsTo } from '@ember-data/model';

export default class SignedResourceModel extends Model {
  /** Optional, content might be in .file instead **/
  @attr content;
  @attr hashValue;
  @attr('boolean', { defaultValue: false }) deleted;
  @attr('datetime') createdOn;

  @belongsTo('blockchain-status', { async: true, inverse: null }) status;
  @belongsTo('gebruiker', { async: true, inverse: null }) gebruiker;
  @belongsTo('agenda', { async: true, inverse: 'signedResources' }) agenda;
  @belongsTo('versioned-besluiten-lijst', {
    async: true,
    inverse: 'signedResources',
  })
  versionedBesluitenLijst;
  @belongsTo('versioned-behandeling', {
    async: true,
    inverse: 'signedResources',
  })
  versionedBehandeling;
  @belongsTo('versioned-notulen', { async: true, inverse: 'signedResources' })
  versionedNotulen;
  /** Optional, content might be in .content instead **/
  @belongsTo('file', { async: true, inverse: null }) file;
}
