import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  uri: attr(),
  lijstnaam: attr(),
  lijstnummer: attr(),
  rechtstreekseVerkiezing: belongsTo('rechtstreekse-verkiezing', { inverse: 'heeftLijst' }),
  kandidaten: hasMany('persoon', { inverse: 'isKandidaatVoor' }),
  rdfaBindings: {// eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    lijstnaam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    lijstnummer: "http://data.vlaanderen.be/ns/mandaat#lijstnummer",
    kandidaten: "http://data.vlaanderen.be/ns/mandaat#heeftKandidaat",
    rechtstreekseVerkiezing: "http://data.vlaanderen.be/ns/mandaat#behoortTot",
    "lijsttype": "http://data.vlaanderen.be/ns/mandaat#lijsttype"
  }
});
