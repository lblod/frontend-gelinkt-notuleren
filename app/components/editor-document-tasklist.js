import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Component.extend({
  tasklistPlugin: service('rdfa-editor-document-tasklist-plugin'),
  store: service(),
  classNames: ['tasklist'],
  classNameBindings: ['hasTasks:tasklist--open'],
  hasTasks: true,

  async tasklistObserver(){
    //get tasksSolutions from documents
    let updatedTaskSolutions = (await this.editorDocument.tasklistSolutions).toArray();

    //get new tasklists to display
    let tasklists = this.tasklistPlugin.tasklistData;

    //seek for taskSolutions not there in the editor document
    //push them to the updated list
    let newSolutionsNotInEditorDocument = await this.updateNewTasklistSolutions(updatedTaskSolutions, tasklists);

    //create the new tasksolutions, i.e. the ones with no solution
    //and update them in editorDocument.content
    let brandNewSolutions = await this.updateAndCreateNewTaskLists(tasklists);

    updatedTaskSolutions = [...updatedTaskSolutions,
                            ...newSolutionsNotInEditorDocument,
                            ...brandNewSolutions];


    //update them in editorDocument
    this.editorDocument.tasklistSolutions.setObjects(updatedTaskSolutions);

    //and put them in bucket to display
    this.set('tasklistSolutions', updatedTaskSolutions);
    this.toggleProperty('hasTasks');
  },

  async createTasklistSolution(tasklistUri){
    let tasklistSolution = this.store.createRecord('tasklist-solution');
    let tasklist = (await this.store.query('tasklist', {'filter[:uri:]': tasklistUri})).firstObject;
    delete tasklist.uri;
    tasklistSolution.set('tasklist', tasklist);
    await tasklistSolution.save();
    return tasklistSolution;
  },

  async findTasklistSolution(solutionUri){
    let tasklistSolution = (await this.store.query('tasklist-solution', { 'filter[:uri:]': solutionUri }));
    if(tasklistSolution)
      return tasklistSolution.firstObject;
    return null;
  },

  async updateNewTasklistSolutions(existingSolutions, tasklists){
    //TODO: godfucking damn this looks ugly
    //Basically, if a tasklist-solution exits in document content but not in document, it should be synced here
    let tasklistsWithSolution = tasklists.filter(ts => ts.tasklistData.tasklistSolutionUri);

    if(tasklistsWithSolution.length == 0)
      return [];

    let addedTasks = [];

    Promise.all(tasklistsWithSolution
                .map(async td => {
                  let solution = existingSolutions.find(s => s.get('uri') == td.tasklistData.tasklistSolutionUri);
                  let tasklistSolution = await this.findTasklistSolution(td.tasklistData.tasklistSolutionUri);
                  if(!solution && tasklistSolution){
                    addedTasks.push(solution);
                  }
                  return td;
                }));
    return addedTasks;
  },

  async updateAndCreateNewTaskLists(tasklists){
    let tasklistsNoSolution = tasklists.filter(ts => !ts.tasklistData.tasklistSolutionUri);
    return Promise.all(tasklistsNoSolution.map(async ts => {
      let tasklistSolution = await this.createTasklistSolution(ts.tasklistData.tasklistUri);
      //update document content
      this.tasklistPlugin.setTaskSolutionUri(ts, tasklistSolution.uri);
      return tasklistSolution;
    }));
  },

  async didReceiveAttrs(){
    this._super(...arguments);
    this.set('tasklistSolutions', await this.editorDocument.tasklistSolutions);
    if(this.tasklistPlugin)
      this.tasklistPlugin.addObserver('tasklistData.[]',
                                      this.tasklistObserver.bind(this));
  }
});
