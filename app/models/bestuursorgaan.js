import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class BestuursorgaanModel extends Model {
  @attr uri;
  @attr naam;
  @attr('date') bindingEinde;
  @attr('date') bindingStart;

  @belongsTo('bestuurseenheid', { inverse: 'bestuursorganen', async: true })
  bestuurseenheid;
  @belongsTo('bestuursorgaan-classificatie-code', {
    inverse: null,
    async: true,
  })
  classificatie;
  @belongsTo('bestuursorgaan', {
    inverse: 'heeftTijdsspecialisaties',
    async: true,
  })
  isTijdsspecialisatieVan;
  @belongsTo('rechtstreekse-verkiezing', { inverse: 'steltSamen', async: true })
  wordtSamengesteldDoor;

  @hasMany('bestuursorgaan', {
    inverse: 'isTijdsspecialisatieVan',
    async: true,
  })
  heeftTijdsspecialisaties;
  @hasMany('mandaat', { inverse: 'bevatIn', async: true }) bevat;
  @hasMany('bestuursfunctie', { inverse: 'bevatIn', async: true })
  bevatBestuursfunctie;

  rdfaBindings = {
    naam: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    class: 'http://data.vlaanderen.be/ns/besluit#Bestuursorgaan',
    bindingStart: 'http://data.vlaanderen.be/ns/mandaat#bindingStart',
    bindingEinde: 'http://data.vlaanderen.be/ns/mandaat#bindingEinde',
    bestuurseenheid: 'http://data.vlaanderen.be/ns/besluit#bestuurt',
    classificatie: 'http://data.vlaanderen.be/ns/besluit#classificatie',
    isTijdsspecialisatieVan:
      'http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan',
    bevat: 'http://www.w3.org/ns/org#hasPost',
  };
}
