import Controller from '@ember/controller';
import { action } from '@ember/object';
import { dropTask } from 'ember-concurrency';
import { service } from '@ember/service';
import InstallatieVergaderingModel from '../../../models/installatievergadering';

const IV_AP_MAP = [
  'http://data.lblod.info/templates/77eb1d90-6d3b-11ef-a3a6-c39998a0026f',
  'http://data.lblod.info/templates/02cee410-6471-11ef-9943-f704da4e6eb6',
  'http://data.lblod.info/templates/dcdc22a0-6e2e-11ef-a3a6-c39998a0026f',
  'http://data.lblod.info/templates/fc357ed0-6e2e-11ef-a3a6-c39998a0026f',
  'http://data.lblod.info/templates/3679b220-6e32-11ef-a3a6-c39998a0026f',
  'http://data.lblod.info/templates/b10c53d0-6e32-11ef-a3a6-c39998a0026f',
  'http://data.lblod.info/templates/770b2020-6e33-11ef-a3a6-c39998a0026f',
  'http://data.lblod.info/templates/8186d760-6e33-11ef-a3a6-c39998a0026f',
];
const IV_NAME_MAP = [
  'Kennisname van de definitieve verkiezingsuitslag',
  'Onderzoek van de geloofsbrieven',
  'Eedaflegging van de verkozen gemeenteraadsleden',
  'Bepaling van de rangorde van de gemeenteraadsleden',
  'Vaststelling van de fracties',
  'Verkiezing van de voorzitter van de gemeenteraad',
  'Verkiezing van de schepenen',
  'Aanduiding en eedaflegging van de aangewezen-burgemeester',
];
export default class InboxMeetingsNewController extends Controller {
  @service router;
  @service store;
  @service intl;
  /** @type {import("../../../services/template-fetcher").default} */
  @service templateFetcher;

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
    for (let i = 0; i < 8; i++) {
      const agendapoint = this.store.createRecord('agendapunt', {
        position: i,
        geplandOpenbaar: true,
        titel: IV_NAME_MAP[i],
        zitting: this.meeting,
        vorigeAgendapunt: previousAgendapoint,
      });
      const treatment = this.store.createRecord('behandeling-van-agendapunt', {
        openbaar: true,
        onderwerp: agendapoint,
      });
      const template = await this.templateFetcher.fetchByUri({
        uri: IV_AP_MAP[i],
      });
      await template.loadBody();
      promises.push(
        agendapoint.save(),
        treatment
          .initializeDocument(template.body)
          .then(() => treatment.saveAndPersistDocument()),
      );
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
