import Component from "@glimmer/component";
import { action } from "@ember/object";
import {task} from "ember-concurrency-decorators";

export default class AgendaManagerEditComponent extends Component {


  @action
  async toggleGeplandOpenbaar() {
    this.args.agendapunt.geplandOpenbaar = !this.args.agendapunt.geplandOpenbaar;
  }

  get isNew() {
    return this.args.item && this.args.item.isNew;
  }
  @task
  * submitTask(item) {
    yield this.args.saveTask.perform(item);
    this.args.onClose();
  }
  @action
  cancel() {
    this.args.onCancel();
    this.args.onClose();
  }
  @task
  * deleteTask(item) {
    yield this.args.deleteTask.perform(item);
    this.args.onClose();
  }
}
