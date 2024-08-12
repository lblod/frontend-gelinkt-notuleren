import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class InboxMeetingsNewRoute extends Route {
  @service currentSession;
  @service router;
  @service store;

  queryParams = {
    type: {
      refreshModel: true,
    },
  };

  beforeModel() {
    if (!this.currentSession.canWrite) {
      this.router.replaceWith('inbox.meetings');
    }
  }

  model(params) {
    console.log(params);
    const type = params.type;
    switch (type) {
      case 'common':
        return this.createCommonMeeting();
      case 'inauguration-meeting':
        return this.createInaugurationMeeting();
    }
  }

  async createCommonMeeting() {
    let now = new Date();
    return this.store.createRecord('zitting', {
      geplandeStart: now,
      gestartOpTijdstip: now,
    });
  }

  async createInaugurationMeeting() {
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
    return this.store.createRecord('installatievergadering', {
      geplandeStart: now,
      gestartOpTijdstip: now,
      bestuursorgaan,
    });
  }
}
