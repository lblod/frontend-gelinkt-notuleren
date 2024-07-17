import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class PersoonModel extends Model {
  @attr uri;
  @attr achternaam;
  @attr alternatieveNaam;
  @attr gebruikteVoornaam;

  @belongsTo('geboorte', { inverse: null, async: true }) geboorte;
  @belongsTo('identificator', { inverse: null, async: true }) identificator;
  @belongsTo('geslacht-code', { inverse: null, async: true }) geslacht;

  @hasMany('mandataris', { inverse: 'isBestuurlijkeAliasVan', async: true })
  isAangesteldAls;
  @hasMany('kandidatenlijst', { inverse: 'kandidaten', async: true })
  isKandidaatVoor;
  @hasMany('verkiezingsresultaat', { inverse: null, async: true })
  verkiezingsresultaten;

  get fullName() {
    return `${this.gebruikteVoornaam} ${this.achternaam}`;
  }

  rdfaBindings = {
    class: 'http://www.w3.org/ns/person#Person',
    achternaam: 'http://xmlns.com/foaf/0.1/familyName',
    gebruikteVoornaam: 'http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam',
    alternatieveNaam: 'http://xmlns.com/foaf/0.1/name',
    geslacht: 'http://data.vlaanderen.be/ns/persoon#geslacht',
    isAangesteldAls: 'http://data.vlaanderen.be/ns/mandaat#isAangesteldAls',
    geboorte: 'http://data.vlaanderen.be/ns/persoon#heeftGeboorte',
  };
}
