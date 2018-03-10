import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  beschrijving: attr(),
  geplandOpenbaar: attr(),
  heeftOntwerpbesluit: attr(),
  titel: attr(),
  type: attr('string-set'),
  vorigeAgendapunt: belongsTo('agendapunt', {inverse: null }),
  referenties: hasMany('agendapunt', {inverse: null }),
  agenda: belongsTo('agenda', {inverse: null })
});
