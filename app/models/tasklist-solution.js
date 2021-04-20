import BaseTasklistSolutionModel from '@lblod/ember-vo-tasklist/models/tasklist-solution';
import { attr } from '@ember-data/model';

export default class TasklistSolutionModel extends BaseTasklistSolutionModel {
  @attr uri;
  @attr('number') index;
}
