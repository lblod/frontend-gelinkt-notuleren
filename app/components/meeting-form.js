import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class MeetingForm extends Component{
  @action
  select() {
    console.log('selected')
  }
  @action
  save() {
    console.log('save')
    this.args.save()
  }
}
