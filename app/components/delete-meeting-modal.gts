import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import type RouterService from '@ember/routing/router-service';
import { on } from '@ember/modifier';
import { task, timeout } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import t from 'ember-intl/helpers/t';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
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

  @tracked error = '';

  deleteMeeting = task(async () => {
    const meetingId = this.args.meeting.id;
    try {
      await this.args.meeting.destroyRecord();
      this.args.closeModal();
      await this.pollWhileMeetingExists.perform(meetingId);
    } catch (err) {
      console.error('Error when deleting meeting record', err);
      // TODO handle cases such as a 409 (published meeting parts) with a translated error
      if (typeof err === 'object' && err && 'error' in err) {
        this.error = err.error as string;
      }
    }
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
        {{#if this.error}}
          <AuAlert
            @title={{this.error}}
            @skin='error'
            @icon='cross'
            @size='small'
          />
        {{/if}}
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
