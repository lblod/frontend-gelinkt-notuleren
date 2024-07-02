import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class MandatarisModel extends Model {
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr('language-string') rangorde;
  @attr uri;
  @attr('datetime') datumEedaflegging;
  @attr('datetime') datumMinistrieelBesluit;
  @attr generatedFrom;

  @belongsTo('mandaat', { inverse: null, async: true }) bekleedt;
  @belongsTo('lidmaatschap', { inverse: 'lid', async: true }) heeftLidmaatschap;
  @belongsTo('persoon', { inverse: 'isAangesteldAls', async: true })
  isBestuurlijkeAliasVan;
  @belongsTo('mandataris-status-code', { inverse: null, async: true }) status;

  @hasMany('mandataris', { inverse: null, async: true }) tijdelijkeVervangingen;
  @hasMany('beleidsdomein-code', { inverse: 'mandatarissen', async: true })
  beleidsdomein;
  @hasMany('behandeling-van-agendapunt', { inverse: null, async: true })
  aanwezigBijBehandeling;
  @hasMany('behandeling-van-agendapunt', { inverse: null, async: true })
  afwezigBijBehandeling;
  @hasMany('zitting', { inverse: null, async: true }) aanwezigBijZitting;
  @hasMany('zitting', { inverse: null, async: true }) afwezigBijZitting;

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
