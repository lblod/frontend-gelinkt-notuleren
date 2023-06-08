import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class MeetingsPublishPublicationActionsIndexRoute extends Route {
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
  };

  model(params) {
    const query = {
      filter: { zitting: { ':id:': this.meetingId } },
      sort: params.sort,
      page: {
        size: params.size,
        number: params.page,
      },
    };

    return this.store.query('publishing-log', query);
  }
}
