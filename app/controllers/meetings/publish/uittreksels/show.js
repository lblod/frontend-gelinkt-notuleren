import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

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

  signatureData = trackedFunction(this, async () => {
    const signatures = (this.model.signedResources?.toArray() || []).filter(
      (signature) => !signature.deleted
    );
    const first = signatures[0];
    const second = signatures[1];
    const result = { first: null, second: null, count: 0 };
    if (first) {
      const user = await first.gebruiker;
      result.first = {
        model: first,
        user,
      };
      result.count = 1;
    }
    if (second) {
      const user = await second.gebruiker;
      result.second = {
        model: second,
        user,
      };
      result.count = 2;
    }
    return result;
  });

  get signatures() {
    return this.signatureData.value ?? { first: null, second: null, count: 0 };
  }

  get firstSignature() {
    return this.signatures.first;
  }

  get secondSignature() {
    return this.signatures.second;
  }

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
   * @returns {boolean}
   */
  get loading() {
    return this.signDocumentTask.isRunning;
  }

  /**
   * @returns {boolean}
   */
  get canSignFirstSignature() {
    return (
      !this.loading &&
      this.currentSession.canSign &&
      this.signatures.count === 0
    );
  }

  /**
   * @returns {boolean}
   */
  get canSignSecondSignature() {
    return (
      !this.loading &&
      this.currentSession.canSign &&
      this.currentSession.user.id !== this.firstSignature?.user?.id &&
      this.signatures.count === 1
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
    if (this.signatures.count === 1) {
      return {
        name: 'firstSignature',
        icon: 'message',
        generalLabel: this.intl.t('publish.first-signature-obtained'),
        previewLabel: this.intl.t('publish.need-second-signature'),
        generalColor: 'warning',
        previewColor: 'success',
      };
    }
    if (this.signatures.count > 1) {
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
      const log = this.store.createRecord('publishing-log', {
        action: 'sign',
        user: this.currentSession.user,
        date: new Date(),
        signedResource: signature,
        zitting: this.meeting,
      });
      await log.save();
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
