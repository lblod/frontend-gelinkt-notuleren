import Model, { attr, belongsTo } from '@ember-data/model';

export default class LidmaatschapModel extends Model {
  @attr uri;

  @belongsTo('fractie', { inverse: null, async: true }) binnenFractie;
  @belongsTo('mandataris', { inverse: 'heeftLidmaatschap', async: true }) lid;
  @belongsTo('tijdsinterval', { inverse: null, async: true }) lidGedurende;
}
