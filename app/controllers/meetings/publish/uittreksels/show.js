import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
export default class MeetingsPublishUittrekselsShowController extends Controller {
  @tracked error;
  @tracked extract;
  @service publish;
  @service store;
  @service router;

  get agendapoint() {
    return  this.model.get('onderwerp');
  }

  get meeting() {
    return this.model.get('onderwerp.zitting');
  }

  get title() {
    return this.agendapoint.titel;
  }

  get createSignedResourceTask() {
    return this._createSignedResourceTask.unlinked();
  }

  get createPublishedResourceTask() {
    return this._createPublishedResourceTask.unlinked();
  }

  @task
    *_createSignedResourceTask(behandeling) {
      try {
        this.error = null;
        const result = yield fetch(`/signing/behandeling/sign/${this.meeting.get('id')}/${behandeling.get('id')}`, {
          method: 'POST',
        });
        if (! result.ok) {
          const json = yield result.json();
          const errors = json?.errors?.join("\n");
          throw errors;
        }
        yield this.loadExtract.perform();
      }
      catch(e) {
        this.extract = null;
        this.error = e;
      }
    }

  @task
    *_createPublishedResourceTask(behandeling) {
      try {
        this.error = null;
        const result = yield fetch(`/signing/behandeling/publish/${this.meeting.get('id')}/${behandeling.get('id')}`, {
        method: 'POST',
        });
        if (! result.ok) {
          const json = yield result.json();
          const errors = json?.errors?.join("\n");
          throw errors;
        }
        yield this.loadExtract.perform();
      }
      catch(e) {
        this.extract = null;
        this.error = e;
      }
    }

  @action
  print(extract) {
    this.router.transitionTo(
      'print.uittreksel',
      this.meeting.get('id'),
      extract.treatmentId
    );
  }

  get mockBehandeling() {
    return {
      body: this.extract.document.content,
      signedId: this.meeting.get('id')
    };
  }

  @task
    * loadExtract() {
      try {
        this.extract = null;
        this.error = null;
        const treatment = this.model;
        this.extract = yield this.publish.fetchExtract(treatment);
      }
      catch(e) {
        this.error = e;
      }
    }
}

