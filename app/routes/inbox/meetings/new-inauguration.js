import Route from '@ember/routing/route';
import { service } from '@ember/service';
import { format } from 'date-fns/fp';
import { IV_CLASSIFICATIE_MAP } from '../../../config/constants';

export default class InboxMeetingsNewInaugurationRoute extends Route {
  @service currentSession;
  @service router;
  @service store;
  @service templateFetcher;
  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.meetings');
    }
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.setup();
  }
  async model() {
    let now = new Date();
    const unitClass = await this.currentSession.group.classificatie;
    const bestuursorgaan = (
      await this.store.query('bestuursorgaan', {
        include: [
          'is-tijdsspecialisatie-van.bestuurseenheid',
          'is-tijdsspecialisatie-van.classificatie',
        ].join(','),
        filter: {
          ':or:': {
            ':gte:binding-einde': format('yyyy-mm-dd')(now),
            ':has-no:binding-einde': true,
          },
          'is-tijdsspecialisatie-van': {
            bestuurseenheid: {
              id: this.currentSession.group.id,
            },
            classificatie: {
              ':uri:': IV_CLASSIFICATIE_MAP[unitClass.uri],
            },
          },
        },
      })
    )[0];

    return { bestuursorgaan };
  }
}
