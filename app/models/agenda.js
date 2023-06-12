import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agenda extends Model {
  @attr inhoud;
  @attr agendaStatus;
  @attr agendaType;
  @attr renderedContent;
  @attr('boolean', { defaultValue: false }) deleted;

  @belongsTo('zitting', { inverse: null }) zitting;
  @belongsTo('published-resource', { inverse: 'agenda' }) publishedResource;

  @hasMany('signed-resource', { inverse: 'agenda' }) signedResources;
}
