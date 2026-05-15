import type { AsyncBelongsTo } from '@ember-data/model';
import Model, { attr, belongsTo } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type BlockchainStatusModel from './blockchain-status';
import type GebruikerModel from './gebruiker';
import type Agenda from './agenda';
import type VersionedBesluitenLijstModel from './versioned-besluiten-lijst';
import type VersionedBehandeling from './versioned-behandeling';
import type VersionedNotulenModel from './versioned-notulen';
import type FileModel from './file';

export default class PublishedResource extends Model {
  declare [Type]: 'published-resource';

  /** Optional, content might be in .file instead **/
  @attr content?: string;
  @attr hashValue?: string;
  @attr('datetime') createdOn?: Date;
  @attr submissionStatus?: string;

  @belongsTo('blockchain-status', { async: true, inverse: null })
  declare status: AsyncBelongsTo<BlockchainStatusModel>;
  @belongsTo<GebruikerModel>('gebruiker', { async: true, inverse: null })
  declare gebruiker: AsyncBelongsTo<GebruikerModel>;
  @belongsTo('agenda', { async: true, inverse: 'publishedResource' })
  declare agenda: AsyncBelongsTo<Agenda>;
  @belongsTo('versioned-besluiten-lijst', {
    async: true,
    inverse: 'publishedResource',
  })
  declare versionedBesluitenLijst: AsyncBelongsTo<VersionedBesluitenLijstModel>;
  @belongsTo<VersionedBehandeling>('versioned-behandeling', {
    async: true,
    inverse: 'publishedResource',
  })
  declare versionedBehandeling: AsyncBelongsTo<VersionedBehandeling>;
  @belongsTo('versioned-notulen', { async: true, inverse: 'publishedResource' })
  declare versionedNotulen: AsyncBelongsTo<VersionedNotulenModel>;
  /** Optional, content might be in .content instead **/
  @belongsTo('file', { async: true, inverse: null })
  declare file: AsyncBelongsTo<FileModel>;
}
