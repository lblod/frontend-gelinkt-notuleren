import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { Extract } from 'frontend-gelinkt-notuleren/services/publish';

export default class ExtractPreviewComponent extends Component {
  @tracked error;
  @tracked extract;
  @tracked sectionOpen = false;
  @service publish;
  @service store;
  @service router;

  get agendapoint() {
    return  this.args.agendapoint;
  }

  get meeting() {
    return this.args.meeting;
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
        const result = yield fetch(`/signing/behandeling/sign/${this.meeting.id}/${behandeling.get('id')}`, {
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
        const result = yield fetch(`/signing/behandeling/publish/${this.meeting.id}/${behandeling.get('id')}`, {
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
      this.meeting.id,
      extract.treatmentId
    );
  }

  get mockBehandeling() {
    return {
      body: this.extract.document.content,
      signedId: this.meeting.id
    };
  }

  @task
    * loadExtract() {
      try {
        this.extract = null;
        this.error = null;
        this.sectionOpen = true;
        const treatment = yield this.agendapoint.get('behandeling');
        const versionedTreatments = yield this.store.query('versioned-behandeling',
                                                           {
                                                             filter: { behandeling: {":id:": treatment.id}},
                                                             include: 'behandeling.onderwerp,signed-resources,published-resource'
                                                           });
        if (versionedTreatments.length > 0 ) {
          this.extract = new Extract(
            treatment.id,
            this.agendapoint.position,
            versionedTreatments.get('firstObject'),
            []
          );
      }
        else {
          const extractPreview = this.store.createRecord('extract-preview', {treatment});
          yield extractPreview.save();
          const versionedTreatment = this.store.createRecord(
            'versioned-behandeling',
            {
              zitting: this.agendapoint.meeting,
              content: extractPreview.html,
              behandeling: treatment,
            }
          );
          this.extract = new Extract(
            treatment.id,
            this.agendapoint.position,
            versionedTreatment,
            extractPreview.meta?.validationErrors
          );
        }
      }
      catch(e) {
        this.error = e;
      }
    }
}
