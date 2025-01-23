import Model, { attr, belongsTo } from '@ember-data/model';

export default class PublishingLogs extends Model {
  @attr action;
  @attr('date') date;

  @belongsTo('signed-resource', { async: true, inverse: null }) signedResource;
  @belongsTo('published-resource', { async: true, inverse: null })
  publishedResource;

  @belongsTo('gebruiker', { async: true, inverse: null }) user;
  @belongsTo('zitting', {
    async: true,
    polymorphic: true,
    inverse: 'publishingLogs',
  })
  zitting;
}
