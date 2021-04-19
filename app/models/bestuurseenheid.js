import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuurseenheidModel extends Model {
  @attr naam;
  @attr uri;
  @belongsTo('bestuurseenheid-classificatie-code', { inverse: null }) classificatie;
  @hasMany('bestuursorgaan', { inverse: 'bestuurseenheid' }) bestuursorganen;

  rdfaBindings = {
    naam: "http://www.w3.org/2004/02/skos/core#prefLabel",
    class: "http://data.vlaanderen.be/ns/besluit#Bestuurseenheid",
    werkingsgebied: "http://data.vlaanderen.be/ns/besluit#werkingsgebied",
    bestuursorgaan: "http://data.vlaanderen.be/ns/besluit#bestuurt",
    classificatie: "http://data.vlaanderen.be/ns/besluit#classificatie"
  }
}
