import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class Agenda extends Model {
  @attr inhoud;
  @attr agendaStatus;
  @attr agendaType;
  @attr renderedContent;

  @belongsTo('zitting', { inverse: 'publicatieAgendas' }) zitting;
  @belongsTo('published-resource', { inverse: 'agenda' }) publishedResource;

  @hasMany('agendapunt', { inverse: 'agenda' }) agendapunten;
  @hasMany('signed-resource', { inverse: 'agenda' }) signedResources;
}
