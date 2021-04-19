import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandatarisModel extends Model {
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr('language-string') rangorde;
  @attr uri;
  @attr('datetime') datumEedaflegging;
  @attr('datetime') datumMinistrieelBesluit;
  @belongsTo('mandaat', { inverse: null }) bekleedt;
  @belongsTo('persoon', { inverse: 'isAangesteldAls' }) isBestuurlijkeAliasVan;
  @hasMany('mandataris', { inverse: null }) tijdelijkeVervangingen;
  @hasMany('behandeling-van-agendapunt') aanwezigBijBehandeling;
  @hasMany('behandeling-van-agendapunt') afwezigBijBehandeling;
  @hasMany('zitting') aanwezigBijZitting;
  @hasMany('zitting') afwezigBijZitting;
  @belongsTo('mandataris-status-code', { inverse: null }) status;

  rdfaBindings = {
    class: "http://data.vlaanderen.be/ns/mandaat#Mandataris",
    start: "http://data.vlaanderen.be/ns/mandaat#start",
    einde: "http://data.vlaanderen.be/ns/mandaat#einde",
    rangorde: "http://data.vlaanderen.be/ns/mandaat#rangorde",
    bekleedt: "http://www.w3.org/ns/org#holds",
    isBestuurlijkeAliasVan: "http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan"
  }
}
