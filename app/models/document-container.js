import { computed } from '@ember/object';
import Model from 'ember-data/model';
import { belongsTo, hasMany } from 'ember-data/relationships';
import defaultContext from '../config/editor-document-default-context';

export default Model.extend({
  revisions: hasMany( 'editor-document' )
});
