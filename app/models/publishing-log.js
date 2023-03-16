import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishingLogs extends Model {
  @attr action;
  @attr('date') date;

  @belongsTo('versioned-agenda') versionedAgenda;
  @belongsTo('versioned-notulen') versionedNotulen;
  @belongsTo('versioned-besluiten-lijst') versionedBesluitenLijst;
  @belongsTo('versioned-behandelingen') versionedBehandeling;

  @belongsTo('gebruiker') user;
  @belongsTo('zitting') zitting;
}
