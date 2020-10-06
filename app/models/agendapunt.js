import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  beschrijving: attr(),
  geplandOpenbaar: attr(),
  heeftOntwerpbesluit: attr(),
  titel: attr("string"),
  type: attr('string-set'),
  position: attr('number'),
  vorigeAgendapunt: belongsTo('agendapunt', {inverse: null }),
  referenties: hasMany('agendapunt', {inverse: null }),
  agenda: belongsTo('agenda', {inverse: null }),
  behandeling: belongsTo('behandeling-van-agendapunt', {inverse:'onderwerp' })
});
