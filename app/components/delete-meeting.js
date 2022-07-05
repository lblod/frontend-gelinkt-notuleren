import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class DeleteMeetingComponent extends Component {
  @service router;
  @service store;
  @tracked displayDeleteModal = false;
  @tracked visible = false;

  constructor(...args) {
    super(...args);
    this.fetchLinkedPublishedResourcesCount.perform();
  }
  @task
  *deleteMeeting() {
    yield this.args.meeting.destroyRecord();
    this.displayDeleteModal = false;
    this.router.transitionTo('inbox.meetings');
  }

  @task
  *fetchLinkedPublishedResourcesCount() {
    const publicationFilter = {
      filter: {
        state: 'gepubliceerd',
        zitting: {
          id: this.args.meeting.id,
        },
      },
    };
    const versionedNotulen = yield this.store.query(
      'versioned-notulen',
      publicationFilter
    );
    const versionedBesluitenLijsten = yield this.store.query(
      'versioned-besluiten-lijst',
      publicationFilter
    );
    const versionedBehandelingen = yield this.store.query(
      'versioned-behandeling',
      publicationFilter
    );
    const agendas = yield this.store.query('agenda', {
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
  }
}
