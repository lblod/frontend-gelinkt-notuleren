import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VersionedRegulatoryStatementModel extends Model {
  @attr state;
  @attr content;
  @attr uri;
  @hasMany('signed-resource') signedResources;
  @belongsTo('published-resource') publishedResource;
  @belongsTo('versioned-behandeling') versionedBehandeling;
  @belongsTo('editor-document') regulatoryStatement;
}
