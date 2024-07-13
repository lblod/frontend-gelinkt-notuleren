import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agenda extends Model {
  @attr inhoud;
  @attr agendaStatus;
  @attr agendaType;
  @attr renderedContent;
  @attr('boolean', { defaultValue: false }) deleted;

  @belongsTo('zitting', { inverse: null, async: true }) zitting;
  @belongsTo('published-resource', { inverse: 'agenda', async: true })
  publishedResource;

  @hasMany('signed-resource', { inverse: 'agenda', async: true })
  signedResources;
}
