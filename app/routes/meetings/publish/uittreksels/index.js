import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsPublishUittrekselsRoute extends Route {
  @service store;

  beforeModel() {
    this.meetingId = this.modelFor('meetings.publish').id;
  }

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
    // filter params
    title: { refreshModel: true },
  };

  async model(params) {
    // versioned behandelingen may not exist for every agenda item
    // this is why we have to query them through the agenda items
    // and can't query them directly
    const query = {
      include: 'behandeling',
      filter: { zitting: { ':id:': this.meetingId } },
      sort: params.sort,
      page: {
        size: params.size,
        number: params.page,
      },
    };

    if (params.title && params.title.length > 0) {
      query['filter[titel]'] = params.title;
    }
    const agendapoints = (
      await this.store.query('agendapunt', query)
    ).toArray();
    const agendapointsToDisplay = [];
    for (let agendapoint of agendapoints) {
      const behandeling = await agendapoint.behandeling;
      const versionedBehandeling = (
        await this.store.query('versioned-behandeling', {
          filter: {
            behandeling: { ':id:': behandeling.id },
            deleted: false,
          },
        })
      ).toArray()[0];
      agendapointsToDisplay.push({
        titel: agendapoint.titel,
        behandeling: agendapoint.behandeling,
        position: agendapoint.position,
        versionedBehandeling,
      });
    }
    return agendapointsToDisplay;
  }
}
