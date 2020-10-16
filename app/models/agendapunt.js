import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import {belongsTo, hasMany} from 'ember-data/relationships';

export default class Agendapunt extends Model {
  @attr beschrijving;
  @attr geplandOpenbaar;
  @attr heeftOntwerpbesluit;
  @attr("string") titel;
  @attr("string-set") type;
  @attr("number") position;
  @belongsTo('agendapunt', {inverse: null}) vorigeAgendapunt;
  @hasMany('agendapunt', {inverse: null}) referenties;
  @belongsTo('agenda', {inverse: null}) agenda;
  @belongsTo('behandeling-van-agendapunt', {inverse: "onderwerp"}) behandeling;
}
