import Model, { attr, hasMany, belongsTo } from '@ember-data/model';
import type { AsyncBelongsTo, AsyncHasMany } from '@ember-data/model';
import type { Type } from '@warp-drive/core-types/symbols';
import type SignedResource from './signed-resource';
import type PublishedResource from './published-resource';
import type EditorDocumentModel from './editor-document';
import type ZittingModel from './zitting';
import type FileModel from './file';

export default class VersionedNotulen extends Model {
  declare [Type]: 'versioned-notulen';

  @attr state?: string;
  @attr content?: string;
  @attr publicContent?: string;
  @attr publicBehandelingen?: string[];
  @attr kind?: string;
  @attr('boolean', { defaultValue: false }) deleted?: boolean;

  @hasMany<SignedResource>('signed-resource', {
    inverse: 'versionedNotulen',
    async: true,
  })
  declare signedResources: AsyncHasMany<SignedResource>;

  @belongsTo<PublishedResource>('published-resource', {
    inverse: 'versionedNotulen',
    async: true,
  })
  declare publishedResource: AsyncBelongsTo<PublishedResource>;
  @belongsTo<EditorDocumentModel>('editor-document', {
    inverse: null,
    async: true,
  })
  declare editorDocument: AsyncBelongsTo<EditorDocumentModel>;
  @belongsTo<ZittingModel>('zitting', {
    inverse: null,
    async: true,
    polymorphic: true,
  })
  declare zitting: AsyncBelongsTo<ZittingModel>;
  @belongsTo<FileModel>('file', { inverse: null, async: true })
  declare file: AsyncBelongsTo<FileModel>;
}
