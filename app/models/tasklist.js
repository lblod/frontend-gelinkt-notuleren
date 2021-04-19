import BaseTasklistModel from '@lblod/ember-vo-tasklist/models/tasklist';
import { attr } from '@ember-data/model';

export default class TasklistModel extends BaseTasklistModel {
  @attr uri;
}
