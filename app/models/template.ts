import Model, { attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';

export default class TemplateModel extends Model {
  declare [Type]: 'template';

  @attr title?: string;
  @attr('string-set', { defaultValue: () => [] }) matches?: string[];
  @attr body?: string;
  @attr('string-set', { defaultValue: () => [] }) contexts?: string[];
  @attr('string-set', { defaultValue: () => [] }) disabledInContexts?: string[];
}
