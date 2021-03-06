import EditTasklistSolution from '@lblod/ember-vo-tasklist/components/tasklist-solution/edit';
export default EditTasklistSolution.extend({
  classNameBindings: ['open:js-accordion--open'],
  open: false,
  actions: {
    toggleOpen(){
      this.toggleProperty('open');
    },
    moveUp(){
      this.onMoveUp(this.tasklistSolution);
    },
    moveDown(){
      this.onMoveDown(this.tasklistSolution);
    }
  }
});
