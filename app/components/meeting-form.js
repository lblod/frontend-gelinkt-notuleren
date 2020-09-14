import Component from '@ember/component';
import { action } from "@ember/object";

export default class MeetingForm extends Component{
  @action
  select() {
    console.log('selected')
  }
}
