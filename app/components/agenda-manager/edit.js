import Component from "@glimmer/component";
import { action } from "@ember/object";
import {task} from "ember-concurrency";

export default class AgendaManagerEditComponent extends Component {



  get isNew() {
    return this.args.itemToEdit && this.args.itemToEdit.isNew;
  }
  @task
  * submitTask(item) {
    yield this.args.saveTask.perform(item);
    this.args.onClose();
  }
  @action
  cancel() {
    this.args.onCancel();
  }
  @task
  * deleteTask(item) {
    yield this.args.deleteTask.perform(item);
    this.args.onClose();
  }
}
