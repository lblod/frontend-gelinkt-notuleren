import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  start: attr('datetime'),
  einde: attr('datetime'),
  rangorde: attr('language-string'),
  uri: attr(),
  bekleedt: belongsTo('mandaat', {inverse: null }),
  isBestuurlijkeAliasVan: belongsTo('persoon', {inverse: 'isAangesteldAls'}),
  tijdelijkeVervangingen: hasMany('mandataris', {inverse: null }),
  datumEedaflegging: attr('datetime'),
  datumMinistrieelBesluit: attr('datetime'),
  aanwezigBijBehandeling: hasMany('behandeling-van-agendapunt'),
  afwezigBijBehandeling: hasMany('behandeling-van-agendapunt'),
  aanwezigBijZitting: hasMany('zitting'),
  afwezigBijZitting: hasMany('zitting'),
  status: belongsTo('mandataris-status-code', {inverse: null}),

  rdfaBindings: { // eslint-disable-line ember/avoid-leaking-state-in-ember-objects
    class: "http://data.vlaanderen.be/ns/mandaat#Mandataris",
    start: "http://data.vlaanderen.be/ns/mandaat#start",
    einde: "http://data.vlaanderen.be/ns/mandaat#einde",
    rangorde: "http://data.vlaanderen.be/ns/mandaat#rangorde",
    bekleedt: "http://www.w3.org/ns/org#holds",
    isBestuurlijkeAliasVan: "http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan"
  }
});
