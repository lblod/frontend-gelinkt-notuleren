import TasklistSolution from '@lblod/ember-vo-tasklist/models/tasklist-solution' ;
import { attr } from '@ember-data/model';
export default TasklistSolution.extend({
  uri: attr(),
  index: attr('number')
});
