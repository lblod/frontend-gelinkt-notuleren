import attr from 'ember-data/attr';
import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  ontwerpBesluitStatus: attr(),
  revisions: hasMany( 'editor-document', { inverse: 'documentContainer' } ),
  currentVersion: belongsTo( 'editor-document', { inverse: null } ),
  status: belongsTo('editor-document-status', { inverse: null }),
  folder: belongsTo('editor-document-folder', { inverse: null }),
  publisher: belongsTo('bestuurseenheid', { inverse: null }),
  versionedAgendas: hasMany('versioned-agenda'),
  versionedNotulen: hasMany('versioned-notulen'),
  versionedBesluitenLijsten: hasMany('versioned-besluiten-lijst'),
  versionedBehandelingen: hasMany('versioned-behandelingen')
});
