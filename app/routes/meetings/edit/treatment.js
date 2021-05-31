import Route from '@ember/routing/route';


export default class MeetingsEditTreatmentRoute extends Route {

  async model(params) {
    const treatment = await this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id
    );
    console.log("ROUTER PARAMS", params);
    return {
      treatment,
      meetingId: this.paramsFor('meetings.edit').id,
    };
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.editor = null;
    controller.fetchOrCreateDocumentTask.perform();
  }

}
