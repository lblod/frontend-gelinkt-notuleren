import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class GeboorteModel extends Model {
  declare [Type]: 'geboorte';

  @attr('date') datum?: Date;
}
