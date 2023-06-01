import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { restartableTask } from 'ember-concurrency';

export default class ZittingLinkComponent extends Component {
  constructor(...args) {
    super(...args);
    this.getMeeting.perform();
  }
  @service router;
  @service store;

  @tracked meeting;

  getMeeting = restartableTask(async () => {
    const result = await this.store.query('zitting', {
      'filter[agendapunten][behandeling][document-container][:id:]':
        this.args.documentContainer.id,
      // Including the agendapunten relationship ensures the cache returns the proper response.
      // TODO: This is a workaround for a mu-cache issue. Remove the include once that's resolved.
      include: 'agendapunten',
    });
    this.meeting = result.firstObject;
  });
}
