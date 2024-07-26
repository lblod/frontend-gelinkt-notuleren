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
  @tracked modalOpen = false;

  get meeting() {
    return this.args.meeting;
  }

  get lastSync() {
    return this.meeting.synchronizedOn;
  }

  get lmbEndpoint(){
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

  get buttonClass() {
    const modifier = this.isUpToDate ? 'up-to-date' : 'out-of-date';

    return `meeting__sync-button meeting__sync-button--${modifier}`;
  }

  get isUpToDate() {
    if(this.lastSync && this.lastModification.value){
      return this.lastSync > this.lastModification.value
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
  closeModal() {
    this.modalOpen = false;
  }

  synchronize = task(async () => {
    let success = true;
    try {
      this.args.meeting.synchronizedOn = new Date();
      await this.args.meeting.save()
      // TODO: synchronize treatments here
      await timeout(2000);
    } catch (e) {
      success = false;
    } finally {
      this.closeModal();
    }
    this.toaster.show(InaugurationMeetingSynchronizationToast, {
      success,
      timeOut: success ? 3000 : null,
    });
  });
}
