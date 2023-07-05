import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class MeetingsPublishPublicationActionsIndexRoute extends Route {
  @service store;

  beforeModel() {
    this.meetingId = this.modelFor('meetings.publish').id;
  }

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    type: { refreshModel: true },
    // filter params
  };

  model(params) {
    const { sort, size, page, type } = params;
    const query = {
      filter: {
        zitting: { ':id:': this.meetingId },
        ...(type && {
          ':or:': {
            'signed-resource': {
              [`:has:${type}`]: 'yes',
            },
            'published-resource': {
              [`:has:${type}`]: 'yes',
            },
          },
        }),
      },
      sort,
      page: {
        size,
        number: page,
      },
    };

    return this.store.query('publishing-log', query);
  }

  resetController(controller, isExiting) {
    if (isExiting) {
      controller.set('type', null);
      controller.set('sort', '-date');
      controller.set('page', 0);
    }
  }
}
