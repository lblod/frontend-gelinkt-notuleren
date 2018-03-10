import Model from 'ember-data/model';
import BesluitModelMixin from 'ember-rdfa-editor-citaten-plugin/mixins/besluit-model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend(BesluitModelMixin, {
  realisatie: belongsTo('rechtsgrond-besluit', { inverse: null }),
  volgendUitBehandelingVanAgendapunt: belongsTo('behandeling-van-agendapunt', { inverse: 'besluiten'}),
  afgeleidUitNotule: belongsTo('editor-document', { inverse: null })
});
