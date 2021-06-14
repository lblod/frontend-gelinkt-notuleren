import Controller from '@ember/controller';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import moment from 'moment';

export default class InboxMeetingsNewController extends Controller {
  @service router;

  get meeting() {
    return this.model;
  }

  @dropTask
  * saveMeetingTask(event) {
    event.preventDefault();

    let bestuursorgaan = yield this.meeting.bestuursorgaan;
    if (!bestuursorgaan) {
      this.meeting.errors.add('bestuursorgaan', 'inbox.meetings.new.meeting.errors.administrativeBody.required');
    }

    if (this.meeting.isValid) {
      yield this.meeting.save();
      this.router.replaceWith('meetings.edit', this.meeting.id);
    }
  }

  @action
  updateAdministrativeBody(administrativeBody) {
    this.meeting.bestuursorgaan = administrativeBody;
    this.meeting.errors.remove('bestuursorgaan');
  }

  @action
  cancelMeetingCreation() {
    this.meeting.destroyRecord();

    // Ember has a bug where using the router service here, reruns the parent's model hooks.
    // More info: https://github.com/emberjs/ember.js/issues/19497
    // TODO use the router service once the bug is fixed
    this.replaceRoute('inbox.meetings');
  }
  /**
   * @param {string | null} [endDate]
   */
  @action
  dateIsLessThanTwoMonthsAgo(endDate) {
    if(!endDate) {
      return true;
    }
    return moment(endDate).isAfter(moment().subtract(2, 'months'));
  }
}
