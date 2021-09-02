import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PrintUittrekselRoute extends Route {
  @service publish;

  async model(params) {
    const { treatment_id: treatmentId, meeting_id: meetingId } = params;
    const treatment = await this.store.findRecord('behandeling-van-agendapunt', treatmentId, { include: 'onderwerp.zitting'});
    const extract = await this.publish.fetchExtract(treatment);
    return { document: extract.document, meetingId, treatmentId };
  }
}
