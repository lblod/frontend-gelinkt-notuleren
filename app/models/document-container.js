import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  revisions: hasMany( 'editor-document', { inverse: 'documentContainer' } ),
  currentVersion: belongsTo( 'editor-document', { inverse: null } ),
  versionedAgendas: hasMany('versioned-agenda'),
  versionedNotulen: hasMany('versioned-notulen')
});
