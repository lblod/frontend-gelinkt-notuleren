import Model, { attr, belongsTo, hasMany } from '@ember-data/model';
import type { AsyncBelongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type { AsyncHasMany } from '@ember-data/model';
import type BestuursorgaanModel from './bestuursorgaan';
import type BestuursfunctieCodeModel from './bestuursfunctie-code';

export default class MandaatModel extends Model {
  declare [Type]: 'mandaat';

  @attr uri?: string;
  @attr aantalHouders?: string;

  @belongsTo('bestuursfunctie-code', { inverse: null, async: true })
  declare bestuursfunctie: AsyncBelongsTo<BestuursfunctieCodeModel>;

  @hasMany('bestuursorgaan', { inverse: 'bevat', async: true })
  declare bevatIn: AsyncHasMany<BestuursorgaanModel>;

  rdfaBindings = {
    class: 'http://data.vlaanderen.be/ns/mandaat#Mandaat',
    aantalHouders: 'http://data.vlaanderen.be/ns/mandaat#aantalHouders',
    bestuursfunctie: 'http://www.w3.org/ns/org#role',
    bevatIn: 'http://www.w3.org/ns/org#hasPost',
  };
}
