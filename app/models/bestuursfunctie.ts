import type { AsyncBelongsTo } from '@ember-data/model';
import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type BestuursfunctieCodeModel from './bestuursfunctie-code';
import type { AsyncHasMany } from '@ember-data/model';
import type BestuursorgaanModel from './bestuursorgaan';

export default class BestuursfunctieModel extends Model {
  declare [Type]: 'bestuursfunctie';

  @attr uri?: string;

  @belongsTo('bestuursfunctie-code', { inverse: null, async: true })
  declare rol: AsyncBelongsTo<BestuursfunctieCodeModel>;

  @hasMany('bestuursorgaan', { inverse: 'bevatBestuursfunctie', async: true })
  declare bevatIn: AsyncHasMany<BestuursorgaanModel>;

  rdfaBindings = {
    class:
      'http://data.lblod.info/vocabularies/leidinggevenden/Bestuursfunctie',
    rol: 'http://www.w3.org/ns/org#role',
    bevatIn: 'http://www.w3.org/ns/org#hasPost',
  };
}
