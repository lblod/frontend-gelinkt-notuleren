import BaseTaskSolutionModel from '@lblod/ember-vo-tasklist/models/task-solution';
import { attr } from '@ember-data/model';

export default class TaskSolutionModel extends BaseTaskSolutionModel {
  @attr uri;
}
