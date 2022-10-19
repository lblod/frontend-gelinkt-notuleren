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

  model(params) {
    const query = {
      include: 'behandeling.versioned-behandeling',
      filter: { zitting: { ':id:': this.meetingId } },
    };

    if (params.title && params.title.length > 0) {
      query['filter[titel]'] = params.title;
    }

    return this.store.query('agendapunt', query);
  }
}
