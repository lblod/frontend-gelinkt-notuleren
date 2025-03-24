import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type GeboorteModel from './geboorte';
import type IdentificatorModel from './identificator';
import type GeslachtCodeModel from './geslacht-code';
import type MandatarisModel from './mandataris';
import type KandidatenlijstModel from './kandidatenlijst';
import type VerkiezingsresultaatModel from './verkiezingsresultaat';
import type { Type } from '@warp-drive/core-types/symbols';

export default class PersoonModel extends Model {
  declare [Type]: 'persoon';

  @attr uri?: string;
  @attr achternaam?: string;
  @attr alternatieveNaam?: string;
  @attr gebruikteVoornaam?: string;

  @belongsTo('geboorte', { inverse: null, async: true })
  declare geboorte: AsyncBelongsTo<GeboorteModel>;
  @belongsTo('identificator', { inverse: null, async: true })
  declare identificator: AsyncBelongsTo<IdentificatorModel>;
  @belongsTo('geslacht-code', { inverse: null, async: true })
  declare geslacht: AsyncBelongsTo<GeslachtCodeModel>;

  @hasMany('mandataris', { inverse: 'isBestuurlijkeAliasVan', async: true })
  declare isAangesteldAls: AsyncHasMany<MandatarisModel>;
  @hasMany('kandidatenlijst', { inverse: 'kandidaten', async: true })
  declare isKandidaatVoor: AsyncHasMany<KandidatenlijstModel>;
  @hasMany('verkiezingsresultaat', { inverse: null, async: true })
  declare verkiezingsresultaten: AsyncHasMany<VerkiezingsresultaatModel>;

  get fullName() {
    return [this.gebruikteVoornaam, this.achternaam].filter(Boolean).join(' ');
  }

  rdfaBindings = {
    class: 'http://www.w3.org/ns/person#Person',
    achternaam: 'http://xmlns.com/foaf/0.1/familyName',
    gebruikteVoornaam: 'http://data.vlaanderen.be/ns/persoon#gebruikteVoornaam',
    alternatieveNaam: 'http://xmlns.com/foaf/0.1/name',
    geslacht: 'http://data.vlaanderen.be/ns/persoon#geslacht',
    isAangesteldAls: 'http://data.vlaanderen.be/ns/mandaat#isAangesteldAls',
    geboorte: 'http://data.vlaanderen.be/ns/persoon#heeftGeboorte',
  };
}
