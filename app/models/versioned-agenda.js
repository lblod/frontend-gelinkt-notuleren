import Model, { attr, belongsTo, hasMany } from '@ember-data/model';

export default class VersionedAgendaModel extends Model {
  @attr state;
  @attr content;
  @attr kind;
  @hasMany('signed-resource') signedResources;
  @belongsTo('published-resource') publishedResource;
  @belongsTo('document-container') documentContainer;
  @belongsTo('editor-document') editorDocument;
}
