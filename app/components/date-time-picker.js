import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class DateTimePicker extends Component{
  date;
  datePart;
  timePart;

  constructor() {
    super(...arguments);
    if(this.args.value) {
      this.date = new Date(this.args.value);
      const hours = this.date.getHours();
      const minutes = this.date.getMinutes();
      this.timePart = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}`;
    }
  }
  @action
  onChangeDate(date) {
    this.date.setDate(date.getDate());
    this.date.setMonth(date.getMonth());
    this.date.setFullYear(date.getFullYear());
    this.args.onChange(this.date);
  }
  @action
  onChangeTime(event) {
    const time = event.target.value;
    if(!time) return;
    const [hour, minute] = time.split(':');
    this.date.setHours(hour);
    this.date.setMinutes(minute);
    this.args.onChange(this.date);
  }
}
