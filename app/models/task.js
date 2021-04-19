import BaseTaskModel from '@lblod/ember-vo-tasklist/models/task';
import { attr } from '@ember-data/model';

export default class TaskModel extends BaseTaskModel {
  @attr uri;
  @attr clickTarget;
}
