import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VersionedRegulatoryStatementModel extends Model {
  @attr state;
  @attr uri;

  @hasMany('signed-resource', { inverse: null }) signedResources;

  @belongsTo('published-resource', { inverse: null }) publishedResource;
  @belongsTo('versioned-behandeling', { inverse: null }) versionedBehandeling;
  @belongsTo('editor-document', { inverse: null }) regulatoryStatement;
  @belongsTo('file', { inverse: null }) file;
}
