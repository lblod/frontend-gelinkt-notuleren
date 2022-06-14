import Controller from '@ember/controller';
import DefaultQueryParamsMixin from 'ember-data-table/mixins/default-query-params';

export default class InboxIrgArchiveController extends Controller.extend(
  DefaultQueryParamsMixin
) {}
