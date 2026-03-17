import Model, { belongsTo } from '@ember-data/model';
import type { AsyncBelongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type ConceptModel from './concept';
import type Agendapunt from './agendapunt';

export default class AgendaPositionModel extends Model {
  declare [Type]: 'agenda-position';

  @belongsTo<ConceptModel>('concept', { inverse: null, async: true })
  declare position: AsyncBelongsTo<ConceptModel>;
  @belongsTo<Agendapunt>('agendapunt', { inverse: null, async: true })
  declare agendapoint: AsyncBelongsTo<Agendapunt>;
}

// skos:prefLabel "before";
// mu:uuid "9c9be842-236f-4738-b642-f4064c86db51";

// skos:prefLabel "during";
// mu:uuid "4790eec5-acd2-4c1d-8e91-90bb2998f87c";

// skos:prefLabel "after";
// mu:uuid "267a09cc-5380-492d-93ad-697b9e99f032";
