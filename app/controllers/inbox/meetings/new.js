import Controller from '@ember/controller';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import { service } from '@ember/service';
import InstallatieVergaderingModel from '../../../models/installatievergadering';

export default class InboxMeetingsNewController extends Controller {
  @service router;
  @service store;
  @service intl;

  queryParams = ['type'];

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

  get isInaugurationMeeting() {
    return this.meeting instanceof InstallatieVergaderingModel;
  }

  get title() {
    if (this.isInaugurationMeeting) {
      return this.intl.t('inbox.meetings.new.inauguration-meeting.title');
    } else {
      return this.intl.t('inbox.meetings.new.common-meeting.title');
    }
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
      if (this.isInaugurationMeeting) {
        await this.setUpInaugurationMeeting();
      }
      this.router.replaceWith('meetings.edit', this.meeting.id);
    }
  });

  async setUpInaugurationMeeting() {
    const promises = [];
    let previousAgendapoint;
    for (let i = 0; i < 9; i++) {
      const agendapoint = this.store.createRecord('agendapunt', {
        position: i,
        geplandOpenbaar: true,
        titel: `Naam Agendapunt ${i}`,
        zitting: this.meeting,
        vorigeAgendapunt: previousAgendapoint,
      });
      const treatment = this.store.createRecord('behandeling-van-agendapunt', {
        openbaar: true,
        onderwerp: agendapoint,
      });
      promises.push(agendapoint.save(), treatment.saveAndPersistDocument());
      previousAgendapoint = agendapoint;
    }
    await Promise.all(promises);
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
    // TODO use the router service once the bug is fixed:
    //this.router.replaceWith('inbox.meetings');
    this.replaceRoute('inbox.meetings');
  }
}
