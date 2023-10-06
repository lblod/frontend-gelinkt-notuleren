import Model, { attr } from '@ember-data/model';
export default class TemplateModel extends Model {
  @attr title;
  @attr('string-set', { defaultValue: () => [] }) matches;
  @attr body;
  @attr('string-set', { defaultValue: () => [] }) contexts;
  @attr('string-set', { defaultValue: () => [] }) disabledInContexts;
}
