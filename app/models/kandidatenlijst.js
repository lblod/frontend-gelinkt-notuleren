import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class KandidatenlijstModel extends Model {
  @attr uri;
  @attr lijstnaam;
  @attr lijstnummer;
  @belongsTo('rechtstreekse-verkiezing', { inverse: 'heeftLijst' }) rechtstreekseVerkiezing;
  @hasMany('persoon', { inverse: 'isKandidaatVoor' }) kandidaten;

  rdfaBindings = {
    lijstnaam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    lijstnummer: "http://data.vlaanderen.be/ns/mandaat#lijstnummer",
    kandidaten: "http://data.vlaanderen.be/ns/mandaat#heeftKandidaat",
    rechtstreekseVerkiezing: "http://data.vlaanderen.be/ns/mandaat#behoortTot",
  }
}
