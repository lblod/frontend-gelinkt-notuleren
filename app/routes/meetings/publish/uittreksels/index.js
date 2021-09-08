import Route from '@ember/routing/route';
import DataTableRouteMixin from 'ember-data-table/mixins/route';

export default class MeetingsPublishUittrekselsRoute extends Route.extend(DataTableRouteMixin) {
  modelName = 'agendapunt';

  beforeModel() {
    this.meetingId = this.modelFor('meetings.publish').id;
  }

  queryParams = {
    page: { refreshModel: true },
    size: { refreshModel: true },
    sort: { refreshModel: true },
    filter: { refreshModel: true },
    // filter params
    title: { refreshModel: true }
  };


  mergeQueryOptions(params) {
    console.log(params);
    const query = {
      include: 'behandeling.versioned-behandeling',
      filter: { zitting: { ":id:": this.meetingId}}
    };

    if (params.title && params.title.length > 0)
      query['filter[titel]'] = params.title;

    return query;
  }
}
