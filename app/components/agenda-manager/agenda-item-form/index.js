import Component from '@glimmer/component';
import {task} from "ember-concurrency-decorators";
import {action} from "@ember/object";

export default class AgendaManagerAgendaItemFormIndexComponent extends Component {

  @task
  *submitTask() {
    yield this.args.onSubmit(this.args.model);
  }

  @action
  submit() {
    this.submitTask.perform();
  }
}
