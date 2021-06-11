import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class AgendaPositionModel extends Model {
  @belongsTo("concept") position;
  @belongsTo("agendapunt") agendapoint;
}

// skos:prefLabel "before";
// mu:uuid "9c9be842-236f-4738-b642-f4064c86db51";

// skos:prefLabel "during";
// mu:uuid "4790eec5-acd2-4c1d-8e91-90bb2998f87c";

// skos:prefLabel "after";
// mu:uuid "267a09cc-5380-492d-93ad-697b9e99f032";
