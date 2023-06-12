import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishingLogs extends Model {
  @attr action;
  @attr('date') date;

  @belongsTo('signed-resource') signedResource;
  @belongsTo('published-resource') publishedResource;

  @belongsTo('gebruiker') user;
  @belongsTo('zitting') zitting;
}
