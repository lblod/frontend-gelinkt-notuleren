import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import { notEmpty } from '@ember/object/computed';

export default Model.extend({
  geplandeStart: attr('datetime'),
  gestartOpTijdstip: attr('datetime'),
  geeindigdOpTijdstip: attr('datetime'),
  opLocatie: attr(),
  bestuursorgaan: belongsTo('bestuursorgaan', { inverse: null }),
  afgeleidUit: attr(),
  behandeldeAgendapunten: hasMany('behandeling-van-agendapunt', { inverse: null }),
  notulen: belongsTo('editor-document', { inverse: null }),
  publicatieAgendas: hasMany('agenda', { inverse: null }),
  agendapunten: hasMany('agendapunt', { inverse: 'zitting' }),
  secretaris: belongsTo('functionaris', { inverse: null }),
  voorzitter:  belongsTo('mandataris', { inverse: null }),
  aanwezigenBijStart: hasMany('mandataris', { inverse: null }),
  afwezigenBijStart: hasMany('mandataris', { inverse: null }),
  isPublished: notEmpty('afgeleidUit')
});
