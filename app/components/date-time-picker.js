import Component from '@glimmer/component';
import { action } from "@ember/object";
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class DateTimePicker extends Component{
  @service intl;
  @tracked date;

  constructor() {
    super(...arguments);
    if(this.args.value) {
      this.date = new Date(this.args.value);
    } else {
      this.date = new Date();
    }
  }

  get hours() {
    return this.date.getHours();
  }

  get minutes() {
    return this.date.getMinutes();
  }

  get datePickerLocalization() {
    return {
      buttonLabel: this.intl.t('auDatePicker.buttonLabel'),
      selectedDateMessage: this.intl.t('auDatePicker.selectedDateMessage'),
      prevMonthLabel: this.intl.t('auDatePicker.prevMonthLabel'),
      nextMonthLabel: this.intl.t('auDatePicker.nextMonthLabel'),
      monthSelectLabel: this.intl.t('auDatePicker.monthSelectLabel'),
      yearSelectLabel: this.intl.t('auDatePicker.yearSelectLabel'),
      closeLabel: this.intl.t('auDatePicker.closeLabel'),
      keyboardInstruction: this.intl.t('auDatePicker.keyboardInstruction'),
      calendarHeading: this.intl.t('auDatePicker.calendarHeading'),
      dayNames: getLocalizedDays(this.intl),
      monthNames: getLocalizedMonths(this.intl),
      monthNamesShort: getLocalizedMonths(this.intl, 'short'),
    };
  }

  @action
  onChangeDate(isoDate, date) {
    let wasDateInputCleared = !date;
    if (!wasDateInputCleared) {
      let newDate = new Date(this.date.getTime());

      newDate.setDate(date.getDate());
      newDate.setMonth(date.getMonth());
      newDate.setFullYear(date.getFullYear());

      this.date = newDate;
      this.args.onChange(this.date);
    }
  }

  @action
  onChangeTime(type, event) {
    const value = event.target.value;
    let newDate = new Date(this.date.getTime());

    if(type === 'hours') {
      newDate.setHours(value);
    } else {
      newDate.setMinutes(value);
    }

    this.date = newDate;
    this.args.onChange(this.date);
  }
}

function getLocalizedMonths(intl, monthFormat = 'long') {
  let someYear = 2021;
  return [...Array(12).keys()]
    .map((monthIndex) => {
      let date = new Date(someYear, monthIndex);
      return intl.formatDate(date, { month: monthFormat });
    });
}

function getLocalizedDays(intl, weekdayFormat = 'long') {
  let someSunday = new Date('2021-01-03');
  return [...Array(7).keys()]
    .map((index) => {
      let weekday = new Date(someSunday.getTime());
      weekday.setDate(someSunday.getDate() + index);
      return intl.formatDate(weekday, { weekday: weekdayFormat });
    });
}
