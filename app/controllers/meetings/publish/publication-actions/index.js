import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
export default class MeetingsPublishPublicationActionsController extends Controller {
  @service intl;
  sort = '-date';
  @tracked page = 0;
  @tracked pageSize = 20;

  actionLabel = (log) => {
    return this.intl.t(
      `meetings.publish.publication-actions.actions.${log.action}`
    );
  };
}
