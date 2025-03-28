import Model, {
  attr,
  belongsTo,
  hasMany,
  type AsyncBelongsTo,
  type AsyncHasMany,
} from '@ember-data/model';
import type { LangString } from 'frontend-gelinkt-notuleren/utils/types';
import type MandaatModel from './mandaat';
import type LidmaatschapModel from './lidmaatschap';
import type PersoonModel from './persoon';
import type MandatarisStatusCodeModel from './mandataris-status-code';
import type BeleidsdomeinCodeModel from './beleidsdomein-code';
import type BehandelingVanAgendapunt from './behandeling-van-agendapunt';
import type ZittingModel from './zitting';
import type { Type } from '@warp-drive/core-types/symbols';

export default class MandatarisModel extends Model {
  declare [Type]: 'mandataris';

  @attr('datetime') start?: Date;
  @attr('datetime') einde?: Date;
  @attr('language-string') rangorde?: LangString;
  @attr uri?: string;
  @attr('datetime') datumEedaflegging?: Date;
  @attr('datetime') datumMinistrieelBesluit?: Date;
  @attr generatedFrom?: string[];

  @belongsTo('mandaat', { inverse: null, async: true })
  declare bekleedt: AsyncBelongsTo<MandaatModel>;
  @belongsTo('lidmaatschap', { inverse: 'lid', async: true })
  declare heeftLidmaatschap: AsyncBelongsTo<LidmaatschapModel>;
  @belongsTo('persoon', { inverse: 'isAangesteldAls', async: true })
  declare isBestuurlijkeAliasVan: AsyncBelongsTo<PersoonModel>;
  @belongsTo('mandataris-status-code', { inverse: null, async: true })
  declare status: AsyncBelongsTo<MandatarisStatusCodeModel>;

  @hasMany('mandataris', { inverse: null, async: true })
  declare tijdelijkeVervangingen: AsyncHasMany<MandatarisModel>;
  @hasMany('beleidsdomein-code', { inverse: 'mandatarissen', async: true })
  declare beleidsdomein: AsyncHasMany<BeleidsdomeinCodeModel>;
  @hasMany('behandeling-van-agendapunt', { inverse: null, async: true })
  declare aanwezigBijBehandeling: AsyncHasMany<BehandelingVanAgendapunt>;
  @hasMany('behandeling-van-agendapunt', { inverse: null, async: true })
  declare afwezigBijBehandeling: AsyncHasMany<BehandelingVanAgendapunt>;
  @hasMany('zitting', { inverse: null, async: true, polymorphic: true })
  declare aanwezigBijZitting: AsyncHasMany<ZittingModel>;
  @hasMany('zitting', { inverse: null, async: true, polymorphic: true })
  declare afwezigBijZitting: AsyncHasMany<ZittingModel>;

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
