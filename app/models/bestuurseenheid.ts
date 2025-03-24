import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type WerkingsgebiedModel from './werkingsgebied';
import type BestuurseenheidClassificatieCodeModel from './bestuurseenheid-classificatie-code';
import type BestuursorgaanModel from './bestuursorgaan';

export default class BestuurseenheidModel extends Model {
  declare [Type]: 'bestuurseenheid';

  @attr naam: Option<string>;
  @attr alternatieveNaam: Option<string>;
  @attr wilMailOntvangen: Option<string>;
  @attr mailAdres: Option<string>;
  @attr uri: Option<string>;

  @belongsTo('werkingsgebied', { inverse: 'bestuurseenheid', async: true })
  declare werkingsgebied: AsyncBelongsTo<WerkingsgebiedModel>;
  @belongsTo('werkingsgebied', { inverse: null, async: true })
  declare provincie: AsyncBelongsTo<WerkingsgebiedModel>;
  @belongsTo<BestuurseenheidClassificatieCodeModel>(
    'bestuurseenheid-classificatie-code',
    {
      inverse: null,
      async: true,
    },
  )
  declare classificatie: AsyncBelongsTo<BestuurseenheidClassificatieCodeModel>;

  @hasMany('bestuursorgaan', { inverse: 'bestuurseenheid', async: true })
  declare bestuursorganen: AsyncHasMany<BestuursorgaanModel>;

  rdfaBindings = {
    naam: 'http://www.w3.org/2004/02/skos/core#prefLabel',
    class: 'http://data.vlaanderen.be/ns/besluit#Bestuurseenheid',
    werkingsgebied: 'http://data.vlaanderen.be/ns/besluit#werkingsgebied',
    bestuursorgaan: 'http://data.vlaanderen.be/ns/besluit#bestuurt',
    classificatie: 'http://data.vlaanderen.be/ns/besluit#classificatie',
  };
}
