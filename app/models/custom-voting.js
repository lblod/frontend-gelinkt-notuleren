import Model, { belongsTo, attr } from '@ember-data/model';

export default class CustomVotingModel extends Model {
  @attr('number') position;
  @belongsTo('behandeling-van-agendapunt', {
    inverse: 'customVotings',
    async: true,
  })
  behandelingVanAgendapunt;
  @belongsTo('document-container', { inverse: null, async: true })
  votingDocument;
}
