import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  openbaar: attr(),
  afgeleidUit: attr(),
  gevolg: attr('language-string'),
  vorigeBehandelingVanAgendapunt: belongsTo('behandeling-van-agendapunt', {inverse: null }),
  onderwerp: belongsTo('agendapunt', {inverse: 'behandeling' }),
  secretaris: belongsTo('mandataris', {inverse: null }),
  voorzitter: belongsTo('mandataris', {inverse: null }),
  besluiten: hasMany('besluit', {inverse: 'volgendUitBehandelingVanAgendapunt'}),
  aanwezigen: hasMany('mandataris', {inverse: null }),
  // stemmingen: hasMany('stemming', {inverse: null }),
});
