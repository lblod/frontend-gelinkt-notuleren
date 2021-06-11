import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MeetingsPublishUittrekselsController extends Controller {
  @service publish;
  @tracked documentToPrint;
  @tracked showPrintModal;

  @tracked errors;

  initialize() {
    this.documentToPrint = null;
    this.showPrintModal = false;
    this.loadExtractsTask.perform();
  }

  get meeting() {
    return this.model;
  }

  get extracts() {
    return this.publish.treatmentExtracts;
  }

  get isLoading() {
    return this.loadExtractsTask.isRunning;
  }
  get isEmpty() {
    return !this.extracts?.length;
  }

  @task
  *loadExtractsTask() {
    yield this.publish.loadExtractsTask.perform(this.meeting.id);
  }

  get createSignedResourceTask() {
    return this._createSignedResourceTask.unlinked();
  }

  get createPublishedResourceTask() {
    return this._createPublishedResourceTask.unlinked();
  }

  @task
  *_createSignedResourceTask(behandeling) {
    const id = this.model.id;
    yield fetch(`/signing/behandeling/sign/${id}/${behandeling.get('id')}`, {
      method: 'POST',
    });
    yield this.loadExtractsTask.perform();
  }

  @task
  *_createPublishedResourceTask(behandeling) {
    const id = this.model.id;
    yield fetch(`/signing/behandeling/publish/${id}/${behandeling.get('id')}`, {
      method: 'POST',
    });
    yield this.loadExtractsTask.perform();
  }

  @action
  print(extract) {
    this.transitionToRoute(
      'print.uittreksel',
      this.meeting.id,
      extract.treatmentId
    );
  }
}
