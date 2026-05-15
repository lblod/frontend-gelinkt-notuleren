import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import type PublishService from 'frontend-gelinkt-notuleren/services/publish';
import type RouterService from '@ember/routing/router-service';
import type IntlService from 'ember-intl/services/intl';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsPublishUittrekselsShowRoute from 'frontend-gelinkt-notuleren/routes/meetings/publish/uittreksels/show';
import type SignedResource from 'frontend-gelinkt-notuleren/models/signed-resource';
import type PublishingLog from 'frontend-gelinkt-notuleren/models/publishing-log';
import type MuTaskService from 'frontend-gelinkt-notuleren/services/mu-task';

export default class MeetingsPublishUittrekselsShowController extends Controller {
  publicationBaseUrl = ENV.publication.baseUrl;
  @tracked error: Option<unknown>;
  @tracked signingModalOpen = false;
  @tracked publishingModalOpen = false;
  @service declare publish: PublishService;
  @service declare router: RouterService;
  @service declare intl: IntlService;
  @service declare currentSession: CurrentSessionService;
  @service declare store: Store;
  @service declare muTask: MuTaskService;
  declare model: ModelFrom<MeetingsPublishUittrekselsShowRoute>;

  get bestuurseenheid() {
    return this.currentSession.group;
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
    return this.agendapoint?.titel;
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

  get errors() {
    return this.model.validationErrors;
  }

  get loading(): boolean {
    return (
      this.signDocumentTask.isRunning ||
      this.publishDocumentTask.isRunning ||
      this.deleteSignatureTask.isRunning
    );
  }

  get canPublish(): boolean {
    return !this.loading && this.currentSession.canPublish;
  }

  get signatureCount() {
    return this.model.signedResources.length;
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
    if (this.signatureCount === 1) {
      return {
        name: 'firstSignature',
        icon: 'message',
        generalLabel: this.intl.t('publish.first-signature-obtained'),
        previewLabel: this.intl.t('publish.need-second-signature'),
        generalColor: 'warning',
        previewColor: 'success',
      };
    }
    if (this.signatureCount > 1) {
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

  get previewDocument() {
    return {
      body: this.model.versionedTreatment?.content,
      signedId: this.meeting.get('id'),
    };
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
    this.error = undefined;
  }

  signDocumentTask = task(async () => {
    this.closeSigningModal();
    try {
      this.error = null;
      await this.versionedTreatment.save();
      const signature = this.store.createRecord<SignedResource>(
        'signed-resource',
        {
          versionedBehandeling: this.versionedTreatment,
        },
      );
      await signature?.save();
      const log = this.store.createRecord<PublishingLog>('publishing-log', {
        action: 'sign',
        user: this.currentSession.user,
        date: new Date(),
        signedResource: signature,
        zitting: this.meeting,
      });
      await log.save();
      await this.refreshRoute();
    } catch (e) {
      this.error = e;
    }
  });

  deleteSignatureTask = task(async (signature: SignedResource) => {
    signature.deleted = true;
    await signature.save();
    const log = this.store.createRecord<PublishingLog>('publishing-log', {
      action: 'delete-signature',
      user: this.currentSession.user,
      date: new Date(),
      signedResource: signature,
      zitting: this.meeting,
    });
    await log.save();

    // not a mistake
    // at this point, the signature is marked as deleted but the model has not yet reloaded,
    // so it is still in the signedResources array.
    // we could reload the model here, but then we're reloading twice in one call, which seems unnecessary
    if (this.signatureCount === 1) {
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
        },
      );
      if (!result.ok) {
        const json = (await result.json()) as
          | { errors?: { title?: string }[] }
          | undefined;
        // eslint-disable-next-line @typescript-eslint/no-base-to-string
        const errors = json?.errors
          ?.map((error) => error.title || error)
          .join('\n');
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw errors;
      }
      // TODO if the prepublisher would be fully jsonAPI compliant, this would not be needed
      // there is a potential for  a timing issue here as mu-cl-resources needs to be made aware of the changes
      // the prepublisher made just before
      //
      await this.refreshRoute();

      const log = this.store.createRecord<PublishingLog>('publishing-log', {
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
}
