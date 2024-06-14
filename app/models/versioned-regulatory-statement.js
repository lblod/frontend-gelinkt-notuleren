import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VersionedRegulatoryStatementModel extends Model {
  @attr state;
  @attr uri;

  @hasMany('signed-resource', { inverse: null, async: true }) signedResources;

  @belongsTo('published-resource', { inverse: null, async: true })
  publishedResource;
  @belongsTo('versioned-behandeling', { inverse: null, async: true })
  versionedBehandeling;
  @belongsTo('editor-document', { inverse: null, async: true })
  regulatoryStatement;
  @belongsTo('file', { inverse: null, async: true }) file;
}
