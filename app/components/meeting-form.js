import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class MeetingForm extends Component{
  @tracked plannedStart;
  @tracked startedAt;
  @tracked finishedAt;

  constructor() {
    super(...arguments);
    if(this.args.model) {
      this.plannedStart = this.args.model.plannedStart;
      this.startedAt = this.args.model.startedAt;
      this.finishedAt = this.args.model.finishedAt;
    }
  }

  @action
  select() {
    console.log('selected');
  }
  @action
  save() {
    const info = {
      plannedStart: this.plannedStart,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt
    };
    this.args.save(info);
  }
}
