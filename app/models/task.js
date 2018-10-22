import Task from '@lblod/ember-vo-tasklist/models/task' ;
import attr from 'ember-data/attr';
export default Task.extend({
  uri: attr(),
  clickTarget: attr()
});
