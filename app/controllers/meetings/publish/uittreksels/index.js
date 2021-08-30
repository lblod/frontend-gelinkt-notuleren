import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default class MeetingsPublishUittrekselsController extends Controller.extend(DefaultQueryParamsMixin) {
  sort='position';

}
