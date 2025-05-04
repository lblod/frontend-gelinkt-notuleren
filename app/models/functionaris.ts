import Model, { attr, belongsTo, type AsyncBelongsTo } from '@ember-data/model';
import type BestuursfunctieModel from './bestuursfunctie';
import type PersoonModel from './persoon';
import type FunctionarisStatusCodeModel from './functionaris-status-code';
import type { Type } from '@warp-drive/core-types/symbols';

export default class FunctionarisModel extends Model {
  declare [Type]: 'functionaris';

  @attr('datetime') start?: Date;
  @attr('datetime') einde?: Date;
  @attr uri?: string;

  @belongsTo('bestuursfunctie', { inverse: null, async: true })
  declare bekleedt: AsyncBelongsTo<BestuursfunctieModel>;
  @belongsTo('persoon', { inverse: null, async: true })
  declare isBestuurlijkeAliasVan: AsyncBelongsTo<PersoonModel>;
  @belongsTo('functionaris-status-code', { inverse: null, async: true })
  declare status: AsyncBelongsTo<FunctionarisStatusCodeModel>;

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
