import Model, { attr, belongsTo } from '@ember-data/model';

export default class FunctionarisModel extends Model {
  @attr('datetime') start;
  @attr('datetime') einde;
  @attr uri;

  @belongsTo('bestuursfunctie', { inverse: null, async: true }) bekleedt;
  @belongsTo('persoon', { inverse: null, async: true }) isBestuurlijkeAliasVan;
  @belongsTo('functionaris-status-code', { inverse: null, async: true }) status;

  rdfaBindings = {
    class: 'http://data.lblod.info/vocabularies/leidinggevenden/Functionaris',
    start: 'http://data.vlaanderen.be/ns/mandaat#start',
    einde: 'http://data.vlaanderen.be/ns/mandaat#einde',
    bekleedt: 'http://www.w3.org/ns/org#holds',
    isBestuurlijkeAliasVan:
      'http://data.vlaanderen.be/ns/mandaat#isBestuurlijkeAliasVan',
    status: 'http://data.vlaanderen.be/ns/mandaat#status',
  };
}
