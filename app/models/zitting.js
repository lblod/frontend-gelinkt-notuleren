import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';
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
  agendas: hasMany('agenda', { inverse: null }),
  agendapunten: hasMany('agendapunt', { inverse: null }),

  isPublished: notEmpty('afgeleidUit')
});
