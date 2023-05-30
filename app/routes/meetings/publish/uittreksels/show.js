import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
import { hash } from 'rsvp';

export default class MeetingsPublishUittrekselsShowRoute extends Route {
  @service store;

  async model(params) {
    const treatment = await this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id,
      {
        include: 'onderwerp.zitting',
      }
    );
    const { agendapoint } = await hash({
      agendapoint: await treatment.onderwerp,
    });
    const versionedTreatments = await this.store.query(
      'versioned-behandeling',
      {
        'filter[behandeling][:id:]': treatment.id,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
      }
    );
    const versionedTreatment = versionedTreatments.firstObject;
    const meeting = await agendapoint.zitting;

    if (!versionedTreatment) {
      const extractPreview = this.store.createRecord('extract-preview', {
        treatment,
      });
      await extractPreview.save();
      const versionedTreatment = this.store.createRecord(
        'versioned-behandeling',
        {
          zitting: meeting,
          content: extractPreview.html,
          behandeling: treatment,
        }
      );
      const signedResources = [];
      const publishedResource = await versionedTreatment.publishedResource;
      return {
        treatment,
        agendapoint,
        versionedTreatment,
        meeting,
        signedResources,
        publishedResource,
        validationErrors: extractPreview.validationErrors,
      };
    } else {
      const signedResources = await this.store.query('signed-resource', {
        'filter[versioned-behandeling][:id:]': versionedTreatment.id,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
        sort: 'created-on',
      });
      if (signedResources.length > 2) {
        throw new Error('More than 2 undeleted signatures found');
      }
      const publishedResource = await versionedTreatment.publishedResource;
      return {
        treatment,
        agendapoint,
        versionedTreatment,
        meeting,
        signedResources: signedResources.toArray(),
        publishedResource,
        // if a versionedTreatment exists, that means some signature or publication
        // has happened, which means that there are no errors, so we can safely do this
        validationErrors: [],
      };
    }
  }
}
