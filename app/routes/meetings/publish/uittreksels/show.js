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
    console.log('versioned Treatment', versionedTreatment);
    const meeting = await agendapoint.zitting;

    if (!versionedTreatment) {
      console.log('creating a new extract preview');
      console.log(treatment);
      const extractPreview = this.store.createRecord('extract-preview', {
        treatment,
      });
      console.log(extractPreview);
      await extractPreview.save();
      const versionedTreatment = this.store.createRecord(
        'versioned-behandeling',
        {
          zitting: meeting,
          content: extractPreview.html,
          behandeling: treatment,
        }
      );
      const signedResources = await versionedTreatment.signedResources;
      const publishedResource = await versionedTreatment.publishedResource;
      return {
        treatment,
        agendapoint,
        versionedTreatment,
        meeting,
        signedResources,
        publishedResource,
      };
    } else {
      const signedResources = await versionedTreatment.signedResources;
      const publishedResource = await versionedTreatment.publishedResource;
      return {
        treatment,
        agendapoint,
        versionedTreatment,
        meeting,
        signedResources,
        publishedResource,
      };
    }
  }

  setupController(controller) {
    super.setupController(...arguments);
    console.log('firing setupController');
    console.log(...arguments);
    console.log(controller.model);
    controller.setup(async () => {
      console.log('reloading model');
      await this.refresh();
    });
  }
}
