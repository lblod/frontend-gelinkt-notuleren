import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishingLogs extends Model {
  @attr action;
  @attr('date') date;

  @belongsTo('signed-resource', { async: true }) signedResource;
  @belongsTo('published-resource', { async: true }) publishedResource;

  @belongsTo('gebruiker', { async: true }) user;
  @belongsTo('zitting', { async: true }) zitting;
}
