import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import {task} from "ember-concurrency-decorators";

export default class AgendaManagerEditComponent extends Component {
  // @tracked isEditMode = false;

  constructor() {
    super(...arguments);
    // this.isEditMode = this.args.agendapunt.id ? true : false;
  }

  @action
  async toggleGeplandOpenbaar() {
    this.args.agendapunt.geplandOpenbaar = !this.args.agendapunt.geplandOpenbaar;
  }

  get isNew() {
    return this.args.item && this.args.item.isNew;
  }
  @task
  * submit(item) {
    yield this.args.saveTask.perform(item);
    this.args.onClose();
  }
  @action
  cancel() {
    this.args.onCancel();
    this.args.onClose();
  }
}
