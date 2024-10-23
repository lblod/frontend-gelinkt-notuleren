import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
export default class DeleteMeetingComponent extends Component {
  @service router;
  @service store;

  deleteMeeting = task(async () => {
    const meetingId = this.args.meeting.id;
    await this.args.meeting.destroyRecord();
    this.args.closeModal();
    await this.pollWhileMeetingExists.perform(meetingId);
  });

  pollWhileMeetingExists = task(async (id) => {
    await timeout(100);
    try {
      // eslint-disable-next-line no-constant-condition
      let response = await fetch(`/zittingen/${id}`);
      while (response.ok) {
        await timeout(100);
        response = await fetch(`/zittingen/${id}`);
      }
    } finally {
      this.router.transitionTo('inbox.meetings');
    }
  });
}
