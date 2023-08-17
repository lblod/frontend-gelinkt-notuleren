import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
export default class DeleteMeetingComponent extends Component {
  @service router;
  @service store;
  @tracked displayDeleteModal = false;
  @tracked visible = false;

  constructor(...args) {
    super(...args);
    this.fetchLinkedPublishedResourcesCount.perform();
  }

  deleteMeeting = task(async () => {
    const meetingId = this.args.meeting.id;
    await this.args.meeting.destroyRecord();
    this.displayDeleteModal = false;
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

  fetchLinkedPublishedResourcesCount = task(async () => {
    const publicationFilter = {
      filter: {
        state: 'gepubliceerd',
        zitting: {
          id: this.args.meeting.id,
        },
      },
    };
    const versionedNotulen = await this.store.query(
      'versioned-notulen',
      publicationFilter,
    );
    const versionedBesluitenLijsten = await this.store.query(
      'versioned-besluiten-lijst',
      publicationFilter,
    );
    const versionedBehandelingen = await this.store.query(
      'versioned-behandeling',
      publicationFilter,
    );
    const agendas = await this.store.query('agenda', {
      filter: {
        'agenda-status': 'gepubliceerd',
        zitting: {
          id: this.args.meeting.id,
        },
      },
    });
    const publishedResourcesCount =
      agendas.length +
      versionedBehandelingen.length +
      versionedBesluitenLijsten.length +
      versionedNotulen.length;
    this.visible = publishedResourcesCount === 0;
  });
}
