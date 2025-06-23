import type { AsyncHasMany } from '@ember-data/model';
import Model, { attr, hasMany } from '@ember-data/model';
import type BestuursfunctieCodeModel from './bestuursfunctie-code';
import type BestuursorgaanModel from './bestuursorgaan';
import type { Type } from '@warp-drive/core-types/symbols';

export default class BestuursorgaanClassificatieCodeModel extends Model {
  declare [Type]: 'bestuursorgaan-classificatie-code';
  @attr uri?: string;
  @attr label?: string;
  @attr scopeNote?: string;

  @hasMany('bestuursfunctie-code', { inverse: 'standaardTypeVan', async: true })
  declare standaardType: AsyncHasMany<BestuursfunctieCodeModel>;

  @hasMany('bestuursorgaan', { inverse: null, async: true })
  declare isClassificatieVan: AsyncHasMany<BestuursorgaanModel>;
}
