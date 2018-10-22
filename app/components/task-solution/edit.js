import EditTaskSolution from '@lblod/ember-vo-tasklist/components/task-solution/edit';
import { inject as service } from '@ember/service';

export default EditTaskSolution.extend({
  scrollToPlugin: service('rdfa-editor-scroll-to-plugin'),
  actions: {
    scrollTo(location){
      if(location)
        this.scrollToPlugin.scrollTo(location);
    }
  }
});
