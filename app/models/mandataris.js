import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandatarisModel extends Model {
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr('language-string') rangorde;
  @attr uri;
  @attr('datetime') datumEedaflegging;
  @attr('datetime') datumMinistrieelBesluit;
  @attr generatedFrom;

  @belongsTo('mandaat', { inverse: null }) bekleedt;
  @belongsTo('lidmaatschap', { inverse: 'lid' }) heeftLidmaatschap;
  @belongsTo('persoon', { inverse: 'isAangesteldAls' }) isBestuurlijkeAliasVan;
  @belongsTo('mandataris-status-code', { inverse: null }) status;

  @hasMany('mandataris', { inverse: null }) tijdelijkeVervangingen;
  @hasMany('beleidsdomein-code', { inverse: 'mandatarissen' }) beleidsdomein;
  @hasMany('behandeling-van-agendapunt', { inverse: 'aanwezigen' })
  aanwezigBijBehandeling;
  @hasMany('behandeling-van-agendapunt', { inverse: 'afwezigen' })
  afwezigBijBehandeling;
  @hasMany('zitting', { inverse: 'aanwezigenBijStart' }) aanwezigBijZitting;
  @hasMany('zitting', { inverse: 'afwezigenBijStart' }) afwezigBijZitting;

  rdfaBindings = {
    class: 'http://data.vlaanderen.be/ns/mandaat#Mandataris',
    start: 'http://data.vlaanderen.be/ns/mandaat#start',
    einde: 'http://data.vlaanderen.be/ns/mandaat#einde',
    rangorde: 'http://data.vlaanderen.be/ns/mandaat#rangorde',
    bekleedt: 'http://www.w3.org/ns/org#holds',
    isBestuurlijkeAliasVan:
      'http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan',
  };
}
