import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class PrintUittrekselRoute extends Route {
  @service publish;

  async model(params) {
    const { treatment_id: treatmentId, meeting_id: meetingId } = params;
    const extract = this.publish.treatmentExtractsMap.get(treatmentId);

    if (extract) {
      return { document: extract.document, meetingId };
    } else {
      await this.publish.loadExtractsTask.perform(meetingId);
      return {
        document: this.publish.treatmentExtractsMap.get(treatmentId)?.document,
        meetingId,
      };
    }
  }
}
