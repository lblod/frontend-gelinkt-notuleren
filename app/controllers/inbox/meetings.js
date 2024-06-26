import { service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';
export default class InboxMeetingsController extends Controller {
  @service store;
  @service currentSession;
  @service router;

  sort = '-geplande-start';
  @tracked debounceTime = 2000;
  @tracked page = 0;
  @tracked pageSize = 20;

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }

  isInstallationMeeting = (meeting) => {
    return meeting instanceof InstallatieVergaderingModel;
  };

  @action
  async createInstallationMeeting() {
    let now = new Date();
    const bestuursorgaan = (
      await this.store.query('bestuursorgaan', {
        include: [
          'is-tijdsspecialisatie-van.bestuurseenheid',
          'is-tijdsspecialisatie-van.classificatie',
        ].join(','),
        filter: {
          'is-tijdsspecialisatie-van': {
            bestuurseenheid: {
              id: this.currentSession.group.id,
            },
            classificatie: {
              ':uri:':
                'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005',
            },
          },
        },
      })
    )[0];
    const installationmeeting = this.store.createRecord(
      'installatievergadering',
      {
        geplandeStart: now,
        gestartOpTijdstip: now,
        bestuursorgaan,
      },
    );
    await installationmeeting.save();
    const promises = [];
    let previousAgendapoint;
    for (let i = 0; i < 9; i++) {
      const agendapoint = this.store.createRecord('agendapunt', {
        position: i,
        geplandOpenbaar: true,
        titel: `Naam Agendapunt ${i}`,
        zitting: installationmeeting,
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
    this.router.replaceWith('meetings.edit', installationmeeting.id);
  }
}
