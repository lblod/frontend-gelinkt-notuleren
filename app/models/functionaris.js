import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  start: attr('datetime'),
  einde: attr('datetime'),
  uri: attr(),
  bekleedt: belongsTo('bestuursfunctie', {inverse: null }),
  isBestuurlijkeAliasVan: belongsTo('persoon', {inverse: 'isAangesteldAls'}),
  status: belongsTo('functionaris-status-code', {inverse: null }),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.lblod.info/vocabularies/leidinggevenden/Functionaris",
    start: "http://data.vlaanderen.be/ns/mandaat#start",
    einde: "http://data.vlaanderen.be/ns/mandaat#einde",
    bekleedt: "http://www.w3.org/ns/org#holds",
    isBestuurlijkeAliasVan: "http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan",
    status: "http://data.vlaanderen.be/ns/mandaat#status"
  }
});
