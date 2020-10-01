import Component from '@glimmer/component';
import { action } from "@ember/object";

export default class DateTimePicker extends Component{
  date;
  hours;
  minutes;

  constructor() {
    super(...arguments);
    if(this.args.value) {
      this.date = new Date(this.args.value);
      this.hours = this.date.getHours();
      this.minutes = this.date.getMinutes();
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
  onChangeTime(type, event) {
    const value = event.target.value;
    console.log(value)
    if(type === 'hours') {
      if(value < 0 || value > 24) return;
      this.date.setHours(value);
    } else {
      if(value < 0 || value > 60) return;
      this.date.setMinutes(value)
    }
    this.args.onChange(this.date);
  }
}
