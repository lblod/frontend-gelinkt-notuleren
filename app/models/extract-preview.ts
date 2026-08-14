import Model, { belongsTo, attr } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type { AsyncBelongsTo } from '@ember-data/model';
import type BehandelingVanAgendapunt from './behandeling-van-agendapunt';

export type ValidationWarning = {
  treatmentUri: string;
  documentContainerUri: string;
  decisionTitle: string;
  type: string;
  decisionType: string;
};

export default class ExtractPreview extends Model {
  declare [Type]: 'extract-preview';

  @belongsTo<BehandelingVanAgendapunt>('behandeling-van-agendapunt', {
    inverse: null,
    async: true,
  })
  declare treatment: AsyncBelongsTo<BehandelingVanAgendapunt>;
  @attr html?: string;
  @attr('string-set') validationErrors?: string[];
  @attr validationWarnings?: ValidationWarning[];
}
