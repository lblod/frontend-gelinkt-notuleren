import Controller from '@ember/controller';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import { service } from '@ember/service';

export default class InboxMeetingsNewController extends Controller {
  @service router;
  @service store;
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

  @action
  async updatePlannedStart(date) {
    this.meeting.geplandeStart = new Date(date.getTime());
    const bestuursorgaan = await this.meeting.bestuursorgaan;
    if (!bestuursorgaan?.isActive(date)) {
      this.meeting.bestuursorgaan = null;
    }
  }

  get title() {
    return this.intl.t('inbox.meetings.new.common-meeting.title');
  }

  saveMeetingTask = dropTask(async (event) => {
    event.preventDefault();

    let bestuursorgaan = await this.meeting.bestuursorgaan;
    if (!bestuursorgaan) {
      this.meeting.errors.add(
        'bestuursorgaan',
        this.intl.t(
          'inbox.meetings.new.common-meeting.errors.administrative-body.required',
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
    // TODO use router.replaceWith once the bug is fixed:
    // still relevant as of 20/01/2025
    this.router.legacyReplaceWith('inbox.meetings');
  }
}
