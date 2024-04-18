import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishedResourceModel extends Model {
  /** Optional, content might be in .file instead **/
  @attr content;
  @attr hashValue;
  @attr('datetime') createdOn;
  @attr submissionStatus;

  @belongsTo('blockchain-status', { async: true, inverse: null }) status;
  @belongsTo('gebruiker', { async: true, inverse: null }) gebruiker;
  @belongsTo('agenda', { async: true, inverse: 'publishedResource' }) agenda;
  @belongsTo('versioned-besluiten-lijst', {
    async: true,
    inverse: 'publishedResource',
  })
  versionedBesluitenLijst;
  @belongsTo('versioned-behandeling', {
    async: true,
    inverse: 'publishedResource',
  })
  versionedBehandeling;
  @belongsTo('versioned-notulen', { async: true, inverse: 'publishedResource' })
  versionedNotulen;
  /** Optional, content might be in .content instead **/
  @belongsTo('file', { async: true, inverse: null }) file;
}
