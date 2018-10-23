import Persoon from '@lblod/ember-rdfa-editor-mandataris-plugin/models/persoon' ;
import { hasMany } from 'ember-data/relationships';
export default Persoon.extend({
  isKandidaatVoor: hasMany('kandidatenlijst', { inverse: 'kandidaten' }),
  verkiezingsresultaten: hasMany('verkiezingsresultaat', { inverse: null}),
  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://www.w3.org/ns/person#Person",
    achternaam: "http://xmlns.com/foaf/0.1/familyName",
    gebruikteVoornaam: "http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam",
    alternatieveNaam: "http://xmlns.com/foaf/0.1/name",
    geslacht: "http://data.vlaanderen.be/ns/persoon#geslacht",
    isAangesteldAls: "http://data.vlaanderen.be/ns/mandaat#isAangesteldAls",
    geboorte: "http://data.vlaanderen.be/ns/persoon#heeftGeboorte"
  }
});
