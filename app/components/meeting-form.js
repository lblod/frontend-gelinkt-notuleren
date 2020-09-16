import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';

export default class MeetingForm extends Component{
  @tracked plannedStart;
  @tracked startedAt;
  @tracked finishedAt;

  constructor() {
    super(...arguments);
    this.plannedStart = this.args.plannedStart;
    this.startedAt = this.args.startedAt;
    this.finishedAt = this.args.finishedAt;
  }

  @action
  select() {
    console.log('selected')
  }
  @action
  save() {
    const info = {
      plannedStart: this.plannedStart,
      startedAt: this.startedAt,
      finishedAt: this.finishedAt
    }
    console.log('save')
    this.args.save(info)
  }
}
