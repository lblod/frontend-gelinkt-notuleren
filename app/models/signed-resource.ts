import type { AsyncBelongsTo } from '@ember-data/model';
import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type BlockchainStatusModel from './blockchain-status';
import type GebruikerModel from './gebruiker';
import type Agenda from './agenda';
import type VersionedBesluitenLijstModel from './versioned-besluiten-lijst';
import type VersionedBehandeling from './versioned-behandeling';
import type FileModel from './file';
import type VersionedNotulenModel from './versioned-notulen';

export default class SignedResource extends Model {
  declare [Type]: 'signed-resource';

  /** Optional, content might be in .file instead **/
  @attr content?: string;
  @attr hashValue?: string;
  @attr('boolean', { defaultValue: false }) deleted?: boolean;
  @attr('datetime') createdOn?: Date;

  @belongsTo('blockchain-status', { async: true, inverse: null })
  declare status: AsyncBelongsTo<BlockchainStatusModel>;
  @belongsTo('gebruiker', { async: true, inverse: null })
  declare gebruiker: AsyncBelongsTo<GebruikerModel>;
  @belongsTo('agenda', { async: true, inverse: 'signedResources' })
  declare agenda: AsyncBelongsTo<Agenda>;
  @belongsTo('versioned-besluiten-lijst', {
    async: true,
    inverse: 'signedResources',
  })
  declare versionedBesluitenLijst: AsyncBelongsTo<VersionedBesluitenLijstModel>;
  @belongsTo('versioned-behandeling', {
    async: true,
    inverse: 'signedResources',
  })
  declare versionedBehandeling: AsyncBelongsTo<VersionedBehandeling>;
  @belongsTo('versioned-notulen', { async: true, inverse: 'signedResources' })
  declare versionedNotulen: AsyncBelongsTo<VersionedNotulenModel>;
  /** Optional, content might be in .content instead **/
  @belongsTo('file', { async: true, inverse: null })
  declare file: AsyncBelongsTo<FileModel>;
}
