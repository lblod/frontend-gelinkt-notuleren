import Controller from '@ember/controller';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import { service } from '@ember/service';

export default class InboxMeetingsNewController extends Controller {
  @service router;
  @service intl;

  get meeting() {
    return this.model;
  }

  /**
   * @param {ChangeEvent<HTMLInputElement>} event
   */
  @action
  handleUpdateMeetingOpLocatie(event) {
    this.meeting.opLocatie = event.target.value;
  }

  saveMeetingTask = dropTask(async (event) => {
    event.preventDefault();

    let bestuursorgaan = await this.meeting.bestuursorgaan;
    if (!bestuursorgaan) {
      this.meeting.errors.add(
        'bestuursorgaan',
        this.intl.t(
          'inbox.meetings.new.meeting.errors.administrative-body.required',
        ),
      );
    }

    if (this.meeting.isValid) {
      this.meeting.gestartOpTijdstip = this.meeting.geplandeStart;
      await this.meeting.save();
      this.router.replaceWith('meetings.edit', this.meeting.id);
    }
  });

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
    // TODO use the router service once the bug is fixed:
    //this.router.replaceWith('inbox.meetings');
    this.replaceRoute('inbox.meetings');
  }
}
