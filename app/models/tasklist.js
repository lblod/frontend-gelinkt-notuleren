import Tasklist from '@lblod/ember-vo-tasklist/models/tasklist' ;
import { attr } from '@ember-data/model';
export default Tasklist.extend({
  uri: attr()
});
