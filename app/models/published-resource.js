import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishedResourceModel extends Model {
  @attr content;
  @attr hashValue;
  @attr('datetime') createdOn;
  @attr submissionStatus;
  @belongsTo('blockchain-status') status;
  @belongsTo('gebruiker') gebruiker;
  @belongsTo('agenda') agenda;
  @belongsTo('versioned-besluiten-lijst') versionedBesluitenLijst;
  @belongsTo('versioned-notulen') versionedNotulen;
  @belongsTo('versioned-behandeling') versionedBehandeling;
}
