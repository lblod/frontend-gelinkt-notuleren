import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishedResourceModel extends Model {
  @attr content;
  @attr hashValue;
  @attr('datetime') createdOn;
  @attr submissionStatus;

  @belongsTo('blockchain-status', { inverse: null }) status;
  @belongsTo('gebruiker', { inverse: null }) gebruiker;
  @belongsTo('agenda', { inverse: 'publishedResource' }) agenda;
  @belongsTo('versioned-besluiten-lijst', { inverse: 'publishedResource' })
  versionedBesluitenLijst;
  @belongsTo('versioned-behandeling', { inverse: 'publishedResource' })
  versionedBehandeling;
  @belongsTo('versioned-notulen', { inverse: 'publishedResource' })
  versionedNotulen;
}
