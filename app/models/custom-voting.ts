import Model, { belongsTo, attr, type AsyncBelongsTo } from '@ember-data/model';
import type BehandelingVanAgendapunt from './behandeling-van-agendapunt';
import type DocumentContainerModel from './document-container';
import type { Type } from '@warp-drive/core-types/symbols';

export default class CustomVotingModel extends Model {
  declare [Type]: 'custom-voting';

  @attr('number') position?: number;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'customVotings',
    async: true,
  })
  declare behandelingVanAgendapunt: AsyncBelongsTo<BehandelingVanAgendapunt>;
  @belongsTo('document-container', { inverse: null, async: true })
  declare votingDocument: AsyncBelongsTo<DocumentContainerModel>;
}
