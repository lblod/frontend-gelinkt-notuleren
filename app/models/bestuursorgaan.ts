import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import isAfter from 'date-fns/isAfter';
import isBefore from 'date-fns/isBefore';
import type BestuurseenheidModel from './bestuurseenheid';
import type BestuursorgaanClassificatieCodeModel from './bestuursorgaan-classificatie-code';
import type RechtstreekseVerkiezingModel from './rechtstreekse-verkiezing';
import type BestuursperiodeModel from './bestuursperiode';
import type MandaatModel from './mandaat';
import type BestuursfunctieModel from './bestuursfunctie';

export default class BestuursorgaanModel extends Model {
  declare [Type]: 'bestuursorgaan';

  @attr uri?: string;
  @attr naam?: string;
  @attr('date') bindingEinde?: Date;
  @attr('date') bindingStart?: Date;

  @belongsTo('bestuurseenheid', { inverse: 'bestuursorganen', async: true })
  declare bestuurseenheid: AsyncBelongsTo<BestuurseenheidModel>;

  @belongsTo('bestuursorgaan-classificatie-code', {
    inverse: null,
    async: true,
  })
  declare classificatie: AsyncBelongsTo<BestuursorgaanClassificatieCodeModel>;

  @belongsTo('bestuursorgaan', {
    inverse: 'heeftTijdsspecialisaties',
    async: true,
  })
  declare isTijdsspecialisatieVan: AsyncBelongsTo<BestuursorgaanModel>;

  @belongsTo('rechtstreekse-verkiezing', { inverse: 'steltSamen', async: true })
  declare wordtSamengesteldDoor: AsyncBelongsTo<RechtstreekseVerkiezingModel>;

  @belongsTo('bestuursperiode', {
    async: true,
    inverse: null,
  })
  declare bestuursperiode: AsyncBelongsTo<BestuursperiodeModel>;

  @hasMany('bestuursorgaan', {
    inverse: 'isTijdsspecialisatieVan',
    async: true,
  })
  declare heeftTijdsspecialisaties: AsyncHasMany<BestuursorgaanModel>;

  @hasMany('mandaat', { inverse: 'bevatIn', async: true })
  declare bevat: AsyncHasMany<MandaatModel>;

  @hasMany('bestuursfunctie', { inverse: 'bevatIn', async: true })
  declare bevatBestuursfunctie: AsyncHasMany<BestuursfunctieModel>;

  rdfaBindings = {
    naam: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    class: 'http://data.vlaanderen.be/ns/besluit#Bestuursorgaan',
    bindingStart: 'http://data.vlaanderen.be/ns/mandaat#bindingStart',
    bindingEinde: 'http://data.vlaanderen.be/ns/mandaat#bindingEinde',
    bestuurseenheid: 'http://data.vlaanderen.be/ns/besluit#bestuurt',
    classificatie: 'http://data.vlaanderen.be/ns/besluit#classificatie',
    isTijdsspecialisatieVan:
      'http://data.vlaanderen.be/ns/mandaat#isTijdspecialisatieVan',
    bevat: 'http://www.w3.org/ns/org#hasPost',
  };

  /**
   * @param {Date} referenceDate
   */
  isActive(referenceDate: Date) {
    const startDateIsValid =
      !this.bindingStart || isBefore(this.bindingStart, referenceDate);
    const endDateIsValid =
      !this.bindingEinde || isAfter(this.bindingEinde, referenceDate);
    return startDateIsValid && endDateIsValid;
  }
}
