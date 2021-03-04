import Model, { belongsTo } from '@ember-data/model';

export default Model.extend({
  realisatie: belongsTo('rechtsgrond-besluit', { inverse: null }),
  volgendUitBehandelingVanAgendapunt: belongsTo('behandeling-van-agendapunt', { inverse: 'besluiten'}),
  afgeleidUitNotule: belongsTo('editor-document', { inverse: null })
});
