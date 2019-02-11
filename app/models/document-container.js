import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  revisions: hasMany( 'editor-document', { inverse: 'documentContainer' } ),
  currentVersion: belongsTo( 'editor-document', { inverse: null } ),
  status: belongsTo('editor-document-status', {inverse: null }),
  publisher: belongsTo('bestuurseenheid', {inverse: null }),
  versionedAgendas: hasMany('versioned-agenda'),
  versionedNotulen: hasMany('versioned-notulen'),
  versionedBesluitenLijsten: hasMany('versioned-besluiten-lijst')
});
