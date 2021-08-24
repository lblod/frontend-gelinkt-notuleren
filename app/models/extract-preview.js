import Model, { belongsTo, attr } from '@ember-data/model';

export default class ExtractPreviewModel extends Model {
  @belongsTo('behandeling-van-agendapunt') treatment;
  @attr html;

}
