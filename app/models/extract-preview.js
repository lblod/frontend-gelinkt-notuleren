import Model, { belongsTo, attr } from '@ember-data/model';

export default class ExtractPreviewModel extends Model {
  @belongsTo('behandeling-van-agendapunt', { inverse: null, async: true })
  treatment;
  @attr html;
  @attr('string-set') validationErrors;
}
