import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class DeleteMeetingComponent extends Component {
  @service router;
  @tracked displayDeleteModal = false;
  @task
  *deleteMeeting() {
    yield this.args.meeting.destroyRecord();
    this.displayDeleteModal = false;
    this.router.transitionTo('inbox.meetings');
  }
}
