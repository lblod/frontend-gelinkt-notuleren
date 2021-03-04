import Model, { belongsTo, hasMany } from '@ember-data/model';

export default Model.extend({
  revisions: hasMany( 'editor-document', { inverse: 'documentContainer' } ),
  currentVersion: belongsTo( 'editor-document', { inverse: null } ),
  status: belongsTo('concept', { inverse: null }),
  folder: belongsTo('editor-document-folder', { inverse: null }),
  publisher: belongsTo('bestuurseenheid', { inverse: null }),
  versionedAgendas: hasMany('versioned-agenda'),
  versionedNotulen: hasMany('versioned-notulen'),
  versionedBesluitenLijsten: hasMany('versioned-besluiten-lijst'),
  versionedBehandelingen: hasMany('versioned-behandelingen')
});
