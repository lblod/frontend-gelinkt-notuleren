import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { action } from '@ember/object';

export default class AgendaManagerAgendaItemFormIndexComponent extends Component {
  submitTask = task(async () => {
    await this.args.onSubmit(this.args.model);
  });

  @action
  submit() {
    this.submitTask.perform();
  }
}
