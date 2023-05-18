import Model, { attr, belongsTo } from '@ember-data/model';

export default class LidmaatschapModel extends Model {
  @attr uri;

  @belongsTo('fractie', { inverse: null }) binnenFractie;
  @belongsTo('mandataris', { inverse: 'heeftLidmaatschap' }) lid;
  @belongsTo('tijdsinterval', { inverse: null }) lidGedurende;
}
