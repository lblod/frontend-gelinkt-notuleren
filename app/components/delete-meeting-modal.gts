import Component from '@glimmer/component';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { on } from '@ember/modifier';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import type Store from 'frontend-gelinkt-notuleren/services/store';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';

type Sig = {
  Args: {
    show: boolean;
    meeting: ZittingModel;
    closeModal: () => void;
  };
};

export default class DeleteMeetingComponent extends Component<Sig> {
  @service declare router: RouterService;
  @service declare store: Store;

  deleteMeeting = task(async () => {
    const meetingId = this.args.meeting.id;
    await this.args.meeting.destroyRecord();
    this.args.closeModal();
    await this.pollWhileMeetingExists.perform(meetingId);
  });

  pollWhileMeetingExists = task(async (id) => {
    await timeout(100);
    try {
      let response = await fetch(`/zittingen/${id}`);
      while (response.ok) {
        await timeout(100);
        response = await fetch(`/zittingen/${id}`);
      }
    } finally {
      this.router.transitionTo('inbox.meetings');
    }
  });

  <template>
    <AuModal
      @title={{t 'meetings.delete.confirm-message'}}
      @modalOpen={{@show}}
      @closeModal={{@closeModal}}
      as |Modal|
    >
      <Modal.Body>
        <p>{{t 'meetings.delete.warning'}}</p>
      </Modal.Body>
      <Modal.Footer>
        <AuButton
          @disabled={{this.deleteMeeting.isRunning}}
          @alert={{true}}
          {{on 'click' (perform this.deleteMeeting)}}
        >{{t 'meetings.delete.confirm-button'}}</AuButton>
        <AuButton
          @loading={{this.deleteMeeting.isRunning}}
          @loadingMessage={{t 'application.loading'}}
          @disabled={{this.deleteMeeting.isRunning}}
          @skin='secondary'
          {{on 'click' @closeModal}}
        >{{t 'meetings.delete.back'}}</AuButton>
      </Modal.Footer>
    </AuModal>
  </template>
}
