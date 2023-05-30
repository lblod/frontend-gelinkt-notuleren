import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { fetch } from 'fetch';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class MeetingsPublishUittrekselsShowController extends Controller {
  publicationBaseUrl = ENV.publication.baseUrl;
  @tracked error;
  @tracked signingModalOpen = false;
  @tracked publishingModalOpen = false;
  @tracked reloadModel;
  @tracked deleting = false;
  @service publish;
  @service router;
  @service intl;
  @service currentSession;
  @service store;
  @service router;

  signatureData = trackedFunction(this, async () => {
    const signatures = (this.model.signedResources?.toArray() || [])
      .filter((signature) => !signature.deleted)
      .sort((a, b) => (a.createdOn > b.createdOn ? 1 : -1));
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

  get bestuurseenheid() {
    return this.currentSession.group;
  }

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

  get publishedResource() {
    return this.model.publishedResource;
  }

  get isPublished() {
    return !!this.publishedResource;
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
    return (
      this.signDocumentTask.isRunning ||
      this.publishDocumentTask.isRunning ||
      this.deleteSignatureTask.isRunning
    );
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

  /**
   * @returns {boolean}
   */
  get canPublish() {
    return !this.loading && this.currentSession.canPublish;
  }

  @action
  showSigningModal() {
    this.signingModalOpen = true;
  }

  @action showPublishingModal() {
    this.publishingModalOpen = true;
  }

  @action
  closeSigningModal() {
    this.signingModalOpen = false;
  }

  @action
  closePublishingModal() {
    this.publishingModalOpen = false;
  }

  @action
  async refreshRoute() {
    await this.router.refresh();
  }

  get status() {
    let signingLabel = '';
    let signingColor = null;
    if (this.signatures.count === 1) {
      signingLabel = this.intl.t('publish.need-second-signature');
      signingColor = 'warning';
    }
    if (this.signatures.count > 1) {
      signingLabel = this.intl.t('publish.signed-version');
      signingColor = 'success';
    }
    if (this.isPublished) {
      return {
        name: 'published',
        icon: 'check',
        generalLabel: this.intl.t('publish.published'),
        previewLabel: this.intl.t('publish.public-version'),
        generalColor: 'action',
        previewColor: 'action',
        signingLabel,
        signingColor,
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
        signingLabel,
        signingColor,
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
        signingLabel,
        signingColor,
      };
    }
    return {
      name: 'concept',
      icon: 'pencil',
      generalLabel: this.intl.t('publish.in-preparation'),
      previewLabel: '',
      signingLabel,
      signingColor,
    };
  }

  get header() {
    return 'TODO HEADER';
  }

  get createPublishedResourceTask() {
    return this._createPublishedResourceTask.unlinked();
  }

  signDocumentTask = task(async () => {
    this.closeSigningModal();
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
  });

  deleteSignatureTask = task(async (signature) => {
    signature.deleted = true;
    await signature.save();
    const log = this.store.createRecord('publishing-log', {
      action: 'delete-signature',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signature,
      zitting: this.meeting,
    });
    await log.save();
    if (this.signatureData.count === 0) {
      this.versionedTreatment.deleted = true;
      await this.versionedTreatment.save();
    }
    await this.refreshRoute();
  });

  publishDocumentTask = task(async () => {
    this.closePublishingModal();
    try {
      this.error = null;
      const result = await fetch(
        `/signing/behandeling/publish/${this.meeting.id}/${this.treatment.id}`,
        {
          method: 'POST',
        }
      );
      if (!result.ok) {
        const json = await result.json();
        const errors = json?.errors?.join('\n');
        throw errors;
      }
      // TODO if the prepublisher would be fully jsonAPI compliant, this would not be needed
      // there is a potential timing issue here as mu-cl-resources needs to be made aware of the changes
      // the prepublisher made just before
      await this.refreshRoute();

      const log = this.store.createRecord('publishing-log', {
        action: 'publish',
        user: this.currentSession.user,
        date: new Date(),
        publishedResource: this.publishedResource,
        zitting: this.meeting,
      });
      await log.save();
      return this.publishedResource;
    } catch (e) {
      this.error = e;
    }
  });

  get previewDocument() {
    return {
      body: this.model.versionedTreatment?.content,
      signedId: this.meeting.get('id'),
    };
  }
}
