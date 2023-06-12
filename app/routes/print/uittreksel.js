import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class PrintUittrekselRoute extends Route {
  @service publish;
  @service store;

  async model(params) {
    const { treatment_id: treatmentId, meeting_id: meetingId } = params;
    const versionedTreatments = await this.store.query(
      'versioned-behandeling',
      {
        'filter[behandeling][:id:]': treatmentId,
        'filter[:or:][deleted]': false,
        'filter[:or:][:has-no:deleted]': 'yes',
      }
    );
    let versionedTreatment = versionedTreatments.firstObject;
    if (!versionedTreatment) {
      const treatment = await this.store.findRecord(
        'behandeling-van-agendapunt',
        treatmentId
      );
      const meeting = await this.store.findRecord('zitting', meetingId);
      const extractPreview = this.store.createRecord('extract-preview', {
        treatment,
      });
      await extractPreview.save();
      versionedTreatment = this.store.createRecord('versioned-behandeling', {
        zitting: meeting,
        content: extractPreview.html,
        behandeling: treatment,
      });
    }
    return { document: versionedTreatment, meetingId, treatmentId };
  }
}
