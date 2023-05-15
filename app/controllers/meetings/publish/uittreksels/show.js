import Controller from '@ember/controller';
import { task, timeout } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MeetingsPublishUittrekselsShowController extends Controller {
  @tracked error;
  @tracked extract;
  @tracked signingModalOpen = false;
  @tracked reloadModel;
  @service publish;
  @service router;
  @service intl;
  @service currentSession;
  @service store;

  setup(reloadModel) {
    this.reloadModel = reloadModel;
  }

  get agendapoint() {
    return this.model.agendapoint;
  }

  get versionedTreatment() {
    return this.model.versionedTreatment;
  }

  get meeting() {
    return this.model.meeting;
  }

  get title() {
    return this.agendapoint.titel;
  }

  get treatment() {
    return this.model.treatment;
  }

  get isPublished() {
    return !!this.model.publishedResource;
  }

  /**
   * TODO
   * @returns {*[]}
   */
  get errors() {
    return [];
  }

  /**
   * TODO
   * @returns {boolean}
   */
  get loading() {
    return this.signDocumentTask.isRunning;
  }

  /**
   * TODO
   * @returns {boolean}
   */
  get canSignFirstSignature() {
    return (
      !this.loading &&
      this.currentSession.canSign &&
      this.signatures.length === 0
    );
  }

  /**
   * @returns {boolean}
   */
  get canSignSecondSignature() {
    return (
      !this.loading &&
      this.currentSession.canSign &&
      this.signatures.length === 1
    );
  }

  @action
  showSigningModal() {
    this.signingModalOpen = true;
  }

  @action
  closeSigningModal() {
    this.signingModalOpen = false;
  }

  /**
   * @returns {Signature[]}
   */
  get signatures() {
    return this.model.signedResources;
  }

  get firstSignature() {
    return this.signatures[0] ?? null;
  }

  get secondSignature() {
    return this.signatures[1] ?? null;
  }

  get status() {
    if (this.isPublished) {
      return {
        name: 'published',
        icon: 'check',
        generalLabel: this.intl.t('publish.published'),
        previewLabel: this.intl.t('publish.public-version'),
        generalColor: 'action',
        previewColor: 'action',
      };
    }
    if (this.signatures.length === 1) {
      return {
        name: 'firstSignature',
        icon: 'message',
        generalLabel: this.intl.t('publish.first-signature-obtained'),
        previewLabel: this.intl.t('publish.need-second-signature'),
        generalColor: 'warning',
        previewColor: 'success',
      };
    }
    if (this.signatures.length > 1) {
      return {
        name: 'secondSignature',
        icon: 'message',
        generalLabel: this.intl.t('publish.signed'),
        previewLabel: this.intl.t('publish.signed-version'),
        generalColor: 'success',
        previewColor: 'success',
      };
    }
    return {
      name: 'concept',
      icon: 'pencil',
      generalLabel: this.intl.t('publish.in-preparation'),
      previewLabel: '',
    };
  }

  get header() {
    return 'TODO HEADER';
  }

  get createSignedResourceTask() {
    return this._createSignedResourceTask.unlinked();
  }

  get createPublishedResourceTask() {
    return this._createPublishedResourceTask.unlinked();
  }

  signDocumentTask = task(async () => {
    try {
      this.error = null;
      await this.versionedTreatment.save();
      const signature = await this.store.createRecord('signed-resource', {
        versionedBehandeling: this.versionedTreatment,
      });
      await signature.save();
      // this.versionedTreatment.signedResources.pushObject(signature);
      // await this.versionedTreatment.save();
      // this.treatment.versionedBehandeling = this.versionedTreatment;
      // await this.treatment.save();

      // necessary because the endpoint does not do json-api, so we can't use the normal
      // ember-data flow
    } catch (e) {
      this.error = e;
    }
    this.closeSigningModal();
  });

  _createPublishedResourceTask = task(async (behandeling) => {
    try {
      this.error = null;
      const result = await fetch(
        `/signing/behandeling/publish/${this.meeting.get(
          'id'
        )}/${behandeling.get('id')}`,
        {
          method: 'POST',
        }
      );
      if (!result.ok) {
        const json = await result.json();
        const errors = json?.errors?.join('\n');
        throw errors;
      }
      await this.loadExtract.perform();
      const publishedResource = await this.extract.document.publishedResource;
      return publishedResource;
    } catch (e) {
      this.extract = null;
      this.error = e;
    }
  });

  @action
  print(extract) {
    this.router.transitionTo(
      'print.uittreksel',
      this.meeting.get('id'),
      extract.treatmentId
    );
  }

  get previewDocument() {
    return {
      body: this.model.versionedTreatment?.content,
      signedId: this.meeting.get('id'),
    };
  }

  //
  // loadExtract = task(async () => {
  //   try {
  //     this.extract = null;
  //     this.error = null;
  //     const treatment = this.model;
  //     this.extract = await this.publish.fetchExtract(treatment);
  //   } catch (e) {
  //     this.error = e;
  //   }
  // });
}
