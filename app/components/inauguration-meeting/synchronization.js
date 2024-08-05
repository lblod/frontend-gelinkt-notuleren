import Component from '@glimmer/component';
import { CheckIcon } from '@appuniversum/ember-appuniversum/components/icons/check';
import { SynchronizeIcon } from '@appuniversum/ember-appuniversum/components/icons/synchronize';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { service } from '@ember/service';
import InaugurationMeetingSynchronizationToast from './synchronization-toast';
import { trackedFunction } from 'ember-resources/util/function';
import { executeQuery } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class InaugurationMeetingSynchronizationComponent extends Component {
  @service toaster;
  @service store;
  @tracked modalOpen = false;

  get meeting() {
    return this.args.meeting;
  }

  get lastSync() {
    return this.meeting.synchronizedOn;
  }

  get lmbEndpoint() {
    return ENV.lmbEndpoint;
  }

  lastModification = trackedFunction(this, async () => {
    const query = /* sparql */ `
      PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
      PREFIX mandaat: <http://data.vlaanderen.be/ns/mandaat#>
      PREFIX dct: <http://purl.org/dc/terms/>
      SELECT (max(?m) as ?modified) WHERE {
        ?sub dct:modified ?m.
      }
    `;
    const response = await executeQuery({
      query,
      endpoint: '/vendor-proxy/query',
    });
    const bindings = response.results.bindings;
    if (bindings.length) {
      const modified = bindings[0]['modified'].value;
      return new Date(modified);
    } else {
      return;
    }
  });

  treatments = trackedFunction(this, async () => {
    if (!this.meeting.id) {
      return [];
    }
    const treatments = [];
    const pageSize = 20;
    const firstPage = await this.store.query('behandeling-van-agendapunt', {
      include: ['onderwerp'].join(','),
      'filter[onderwerp][zitting][:id:]': this.meeting.id,
      'page[size]': pageSize,
      sort: 'onderwerp.position',
    });
    const count = firstPage.meta.count;
    firstPage.forEach((result) => treatments.push(result));
    let pageNumber = 1;
    const queries = [];
    while (pageNumber * pageSize < count) {
      queries.push(
        this.store
          .query('behandeling-van-agendapunt', {
            'filter[onderwerp][zitting][:id:]': this.meeting.id,
            'page[size]': pageSize,
            'page[number]': pageNumber,
            include: ['onderwerp'].join(','),
            sort: 'onderwerp.position',
          })
          .then((results) => ({ pageNumber, results })),
      );

      pageNumber++;
    }
    const resultSets = await Promise.all(queries);
    resultSets
      .sort((a, b) => a.pageNumber - b.pageNumber)
      .forEach(({ results }) =>
        results.forEach((result) => treatments.push(result)),
      );
    console.log(treatments);
    return treatments;
  });

  get buttonClass() {
    const modifier = this.isUpToDate ? 'up-to-date' : 'out-of-date';

    return `meeting__sync-button meeting__sync-button--${modifier}`;
  }

  get isUpToDate() {
    if (this.lastSync && this.lastModification.value) {
      return this.lastSync > this.lastModification.value;
    } else {
      return false;
    }
  }

  get buttonIcon() {
    return this.isUpToDate ? CheckIcon : SynchronizeIcon;
  }

  @action
  openModal() {
    this.modalOpen = true;
  }

  @action
  cancel() {
    if (this.synchronize.isRunning) {
      return;
    }
    this.modalOpen = false;
  }

  synchronize = task(async () => {
    let success = true;
    try {
      this.args.meeting.synchronizedOn = new Date();
      await this.args.meeting.save();
      // TODO: synchronize treatments here
      await timeout(2000);
    } catch (e) {
      success = false;
    } finally {
      this.modalOpen = false;
    }
    this.toaster.show(InaugurationMeetingSynchronizationToast, {
      success,
      timeOut: success ? 3000 : null,
    });
  });
}
