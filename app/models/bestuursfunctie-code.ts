import Model, { attr, hasMany, type AsyncHasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type BestuursorgaanClassificatieCodeModel from './bestuursorgaan-classificatie-code';

export default class BestuursfunctieCodeModel extends Model {
  declare [Type]: 'bestuursfunctie-code';

  @attr label?: string;
  @attr scopeNote?: string;
  @attr uri?: string;

  @hasMany('bestuursorgaan-classificatie-code', {
    inverse: 'standaardType',
    async: true,
  })
  declare standaardTypeVan: AsyncHasMany<BestuursorgaanClassificatieCodeModel>;

  rdfaBindings = {
    class: 'http://www.w3.org/2004/02/skos/core#Concept',
    label: 'http://www.w3.org/2004/02/skos/core#prefLabel',
  };
}
