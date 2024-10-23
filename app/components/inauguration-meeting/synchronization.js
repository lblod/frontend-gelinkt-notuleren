import Component from '@glimmer/component';
import { CheckIcon } from '@appuniversum/ember-appuniversum/components/icons/check';
import { SynchronizeIcon } from '@appuniversum/ember-appuniversum/components/icons/synchronize';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import { trackedFunction } from 'reactiveweb/function';
import { executeQuery } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/sparql-helpers';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import InaugurationMeetingSynchronizationToast from './synchronization-toast';
import { syncDocument } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/mandatee-table-plugin';
import SaySerializer from '@lblod/ember-rdfa-editor/core/say-serializer';
import { mandateeTableConfigIVGR } from '../../config/mandatee-table-config';

export default class InaugurationMeetingSynchronizationComponent extends Component {
  @service toaster;
  @service store;
  @service documentService;
  @service intl;
  @service('editor/agendapoint') agendapointEditor;

  @tracked modalOpen = false;

  get meeting() {
    return this.args.meeting;
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
    const treatments = await this.store.countAndFetchAll(
      'behandeling-van-agendapunt',
      {
        filter: {
          onderwerp: {
            zitting: {
              ':id:': this.meeting.id,
            },
          },
        },
        include: [
          'onderwerp',
          'document-container',
          'document-container.current-version',
        ].join(','),
        sort: 'onderwerp.position',
      },
    );
    return treatments;
  });

  get buttonClass() {
    const modifier = this.synchronizationStatus.value?.status;
    if (modifier) {
      return `meeting__sync-button meeting__sync-button--${modifier}`;
    } else {
      return `meeting__sync-button`;
    }
  }

  synchronizationStatus = trackedFunction(this, async () => {
    const synchronizationStatus = await this.meeting.synchronizationStatus;
    const lastModification = await this.lastModification.promise;
    if (!synchronizationStatus) {
      return {
        status: 'out-of-date',
        label: this.intl.t(
          'inauguration-meeting.synchronization.button.out-of-date',
        ),
      };
    }
    if (!synchronizationStatus.success) {
      return {
        status: 'failed',
        label: this.intl.t(
          'inauguration-meeting.synchronization.button.failed',
        ),
      };
    }
    if (synchronizationStatus.timestamp > lastModification) {
      return {
        status: 'up-to-date',
        label: this.intl.t(
          'inauguration-meeting.synchronization.button.up-to-date',
        ),
      };
    } else {
      return {
        status: 'out-of-date',
        label: this.intl.t(
          'inauguration-meeting.synchronization.button.out-of-date',
        ),
      };
    }
  });

  get isUpToDate() {
    if (this.meeting.synchronizationStatus === 'failed') {
      return {
        skin: 'warning',
      };
    }
    if (this.meeting.synchronizedOn && this.lastModification.value) {
      return this.meeting.synchronizedOn > this.lastModification.value;
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
    if (!this.treatments.isResolved) {
      return;
    }
    let success = true;
    let errorMessage = '';
    const timestamp = new Date();
    try {
      const treatments = this.treatments.value.slice();
      await Promise.all(
        treatments.map((treatment) => this.syncTreatment(treatment)),
      );
    } catch (e) {
      errorMessage = e.toString?.();
      console.error(e);
      success = false;
    } finally {
      this.modalOpen = false;
    }
    const status = this.store.createRecord(
      'installatievergadering-synchronization-status',
      {
        timestamp,
        success,
        errorMessage,
      },
    );
    await status.save();
    this.args.meeting.synchronizationStatus = status;
    await this.args.meeting.save();
    this.toaster.show(InaugurationMeetingSynchronizationToast, {
      success,
      timeOut: success ? 3000 : null,
    });
  });

  async syncTreatment(treatment) {
    const container = await treatment.documentContainer;
    const currentVersion = await container.currentVersion;
    const html = currentVersion.content ?? '';
    const initialState = this.agendapointEditor.getState(html);
    const syncedState = await syncDocument(
      initialState,
      mandateeTableConfigIVGR(this.meeting),
    );
    const serializer = SaySerializer.fromSchema(
      syncedState.schema,
      () => syncedState,
    );
    const div = document.createElement('div');
    const doc = serializer.serializeNode(syncedState.doc, undefined);
    div.appendChild(doc);
    const syncedHTML = div.innerHTML;
    await this.documentService.createEditorDocument.perform(
      currentVersion.title,
      syncedHTML,
      container,
      currentVersion,
    );
  }
}
