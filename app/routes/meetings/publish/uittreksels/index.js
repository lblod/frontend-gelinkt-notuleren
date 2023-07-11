import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsPublishUittrekselsRoute extends Route {
  @service store;

  beforeModel() {
    this.meetingId = this.modelFor('meetings.publish').id;
  }

  queryParams = {
    page: { refreshModel: true },
    pageSize: { refreshModel: true },
    sort: { refreshModel: true },
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
      'fields[behandeling]': 'id',
      'fields[document-container]': 'status',
      sort: params.sort,
      page: {
        size: params.pageSize,
        number: params.page,
      },
    };

    if (params.title && params.title.length > 0) {
      query['filter[titel]'] = params.title;
    }
    const result = await this.store.query('agendapunt', query);
    const agendapoints = result.toArray();
    const agendapointsToDisplay = [];
    agendapointsToDisplay.meta = result.meta;

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
