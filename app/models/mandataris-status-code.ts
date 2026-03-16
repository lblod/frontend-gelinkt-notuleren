import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class MandatarisStatusCodeModel extends Model {
  declare [Type]: 'mandataris-status-code';

  @attr uri?: string;
  @attr label?: string;
  @attr scopeNote?: string;
}
