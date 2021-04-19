import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursorgaanModel extends Model {
  @attr uri;
  @attr naam;
  @attr('date') bindingEinde;
  @attr('date') bindingStart;
  @belongsTo('bestuurseenheid', { inverse: 'bestuursorganen' }) bestuurseenheid;
  @belongsTo('bestuursorgaan-classificatie-code', { inverse: null }) classificatie;
  @belongsTo('bestuursorgaan', { inverse: 'heeftTijdsspecialisaties' }) isTijdsspecialisatieVan;
  @belongsTo('rechtstreekse-verkiezing', { inverse: 'steltSamen' }) wordtSamengesteldDoor;
  @hasMany('bestuursorgaan', { inverse: 'isTijdsspecialisatieVan' }) heeftTijdsspecialisaties;
  @hasMany('mandaat', { inverse: 'bevatIn' }) bevat;

  rdfaBindings = {
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuursorgaan",
    bindingStart: "http://data.vlaanderen.be/ns/mandaat#bindingStart",
    bindingEinde: "http://data.vlaanderen.be/ns/mandaat#bindingEinde",
    bestuurseenheid: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie",
    isTijdsspecialisatieVan: "http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan",
    bevat: "http://www.w3.org/ns/org#hasPost"
  }

  // A string representation of this model, based on its attributes.
  // This is what mu-cl-resources uses to search on, and how the model will be presented while editing relationships.
  get stringRep() {
    return [
      this.id,
      this.naam,
      this.bindingEinde,
      this.bindingStart,
    ];
  }
}
