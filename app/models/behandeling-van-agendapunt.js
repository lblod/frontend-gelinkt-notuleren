import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default class BehandelingVanAgendapunt extends Model {
  @attr openbaar;
  @attr afgeleidUit;
  @attr('language-string') gevolg;
  @belongsTo('behandeling-van-agendapunt', { inverse: null }) vorigeBehandelingVanAgendapunt;
  @belongsTo('agendapunt', { inverse: 'behandeling' }) onderwerp;
  @belongsTo('mandataris', { inverse: null }) secretaris;
  @belongsTo('mandataris', { inverse: null }) voorzitter;
  @hasMany('besluit', { inverse: 'volgendUitBehandelingVanAgendapunt' }) besluiten;
  @hasMany('mandataris', { inverse: null }) aanwezigen;
  @belongsTo('document-container') documentContainer;
  // stemmingen: hasMany('stemming', {inverse: null }),
}
