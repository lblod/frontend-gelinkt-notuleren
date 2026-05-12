import Route from '@ember/routing/route';
import { service } from '@ember/service';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import type BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import type ExtractPreview from 'frontend-gelinkt-notuleren/models/extract-preview';
import type SignedResource from 'frontend-gelinkt-notuleren/models/signed-resource';
import type VersionedBehandelingModel from 'frontend-gelinkt-notuleren/models/versioned-behandeling';
import PublishedResourceModel from 'frontend-gelinkt-notuleren/models/published-resource';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';

export default class MeetingsPublishUittrekselsShowRoute extends Route {
  @service declare store: Store;

  async model(params: { treatment_id: string }) {
    const treatment = await this.store.findRecord<BehandelingVanAgendapunt>(
      'behandeling-van-agendapunt',
      params.treatment_id,
      {
        include: ['onderwerp.zitting'],
      },
    );
    const agendapoint = await treatment.onderwerp;
    // In practice Ember doesn't show this route if the meeting doesn't exist
    const meeting = (await agendapoint?.zitting) as ZittingModel;
    const versionedTreatments =
      await this.store.query<VersionedBehandelingModel>(
        'versioned-behandeling',
        {
          'filter[behandeling][:id:]': treatment.id,
          'filter[:or:][deleted]': false,
          'filter[:or:][:has-no:deleted]': 'yes',
        },
      );
    const versionedTreatment = versionedTreatments[0];

    if (!versionedTreatment) {
      const extractPreview = this.store.createRecord<ExtractPreview>(
        'extract-preview',
        {
          treatment,
        },
      );
      await extractPreview.save();
      const newVersionedTreatment =
        this.store.createRecord<VersionedBehandelingModel>(
          'versioned-behandeling',
          {
            zitting: meeting,
            content: extractPreview.html,
            behandeling: treatment,
          },
        );
      const signedResources: SignedResource[] = [];
      const publishedResource = await newVersionedTreatment.publishedResource;
      return {
        treatment,
        agendapoint,
        versionedTreatment: newVersionedTreatment,
        meeting,
        signedResources,
        publishedResource,
        validationErrors: extractPreview.validationErrors,
      };
    } else {
      // because the signedResources endpoint IS jsonAPI compliant,
      // we could have used the relationship here, but the extra filtering
      // needed prevents that
      const signedResources = await this.store.query<SignedResource>(
        'signed-resource',
        {
          'filter[versioned-behandeling][:id:]': versionedTreatment.id,
          'filter[:or:][deleted]': false,
          'filter[:or:][:has-no:deleted]': 'yes',
          sort: 'created-on',
        },
      );
      if (signedResources.length > 2) {
        throw new Error('More than 2 undeleted signatures found');
      }
      // we can't use the relationship here because the published-resource is not
      // created with a jsonAPI compliant endpoint. This means ED is not aware when we create it,
      // causing ED to cache too aggressively. With query, we bypass the cache.
      const publishedResource = await this.store.query<PublishedResourceModel>(
        'published-resource',
        {
          'filter[versioned-behandeling][:id:]': versionedTreatment.id,
        },
      );
      return {
        treatment,
        agendapoint,
        versionedTreatment,
        meeting,
        signedResources: signedResources.slice(),
        publishedResource: publishedResource[0],
        // if a versionedTreatment exists, that means some signature or publication
        // has happened, which means that there are no errors, so we can safely do this
        validationErrors: [],
      };
    }
  }
}
