import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';

export default class DateTimePicker extends Component {
  @service intl;
  date;
  hours;
  minutes;

  constructor() {
    super(...arguments);
    if (this.args.value) {
      this.date = new Date(this.args.value);
      this.hours = this.date.getHours();
      this.minutes = this.date.getMinutes();
    }
  }

  get datePickerLocalization() {
    return {
      buttonLabel: this.intl.t('au-date-picker.button-label'),
      selectedDateMessage: this.intl.t('au-date-picker.selected-date-message'),
      prevMonthLabel: this.intl.t('au-date-picker.prev-month-label'),
      nextMonthLabel: this.intl.t('au-date-picker.next-month-label'),
      monthSelectLabel: this.intl.t('au-date-picker.month-select-label'),
      yearSelectLabel: this.intl.t('au-date-picker.year-select-label'),
      closeLabel: this.intl.t('au-date-picker.close-label'),
      keyboardInstruction: this.intl.t('au-date-picker.keyboard-instruction'),
      calendarHeading: this.intl.t('au-date-picker.calendar-heading'),
      dayNames: getLocalizedDays(this.intl),
      monthNames: getLocalizedMonths(this.intl),
      monthNamesShort: getLocalizedMonths(this.intl, 'short'),
    };
  }

  @action
  onChangeDate(isoDate, date) {
    let wasDateInputCleared = !date;
    if (!wasDateInputCleared) {
      if (!this.date) {
        this.date = new Date();
      }
      this.date.setDate(date.getDate());
      this.date.setMonth(date.getMonth());
      this.date.setFullYear(date.getFullYear());
      this.args.onChange(this.date);
    }
  }

  @action
  onChangeTime(type, event) {
    const value = event.target.value;
    if (!this.date) {
      this.date = new Date();
    }
    if (type === 'hours') {
      if (value < 0 || value > 24) return;
      this.date.setHours(value);
    } else {
      if (value < 0 || value > 60) return;
      this.date.setMinutes(value);
    }
    this.args.onChange(this.date);
  }
}

function getLocalizedMonths(intl, monthFormat = 'long') {
  let someYear = 2021;
  return [...Array(12).keys()].map((monthIndex) => {
    let date = new Date(someYear, monthIndex);
    return intl.formatDate(date, { month: monthFormat });
  });
}

function getLocalizedDays(intl, weekdayFormat = 'long') {
  let someSunday = new Date('2021-01-03');
  return [...Array(7).keys()].map((index) => {
    let weekday = new Date(someSunday.getTime());
    weekday.setDate(someSunday.getDate() + index);
    return intl.formatDate(weekday, { weekday: weekdayFormat });
  });
}
