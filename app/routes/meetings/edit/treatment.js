import Route from '@ember/routing/route';
import { task } from 'ember-concurrency-decorators';

const DRAFT_DECISION_FOLDER_ID = 'ae5feaed-7b70-4533-9417-10fbbc480a4c';
const GEAGENDEERD_STATUS_ID = '7186547b61414095aa2a4affefdcca67';

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
      fetchOrCreateDocumentTask: this.fetchOrCreateDocumentTask
    };
  }
  setupController(controller, model) {
    super.setupController(controller, model);
    controller.editor = null;
    this.fetchOrCreateDocumentTask.perform(model.treatment, controller);
  }

  @task
  *fetchOrCreateDocumentTask(treatment, controller) {
    let documentContainer = yield treatment.documentContainer;
    let document;
    if (documentContainer.content) {
      document = yield documentContainer.get('currentVersion');
      if (!document) {
        document = this.store.createRecord('editor-document', {
          createdOn: new Date(),
          updatedOn: new Date(),
        });
      }
    } else {
      const subject = yield treatment.onderwerp;
      document = this.store.createRecord('editor-document', {
        title: subject.get('titel'),
        createdOn: new Date(),
        updatedOn: new Date(),
      });
      yield document.save();
      const draftDecisionFolder = yield this.store.findRecord(
        'editor-document-folder',
        DRAFT_DECISION_FOLDER_ID
      );
      documentContainer = this.store.createRecord('document-container', {
        folder: draftDecisionFolder,
      });
      documentContainer.status = yield this.store.findRecord(
        'concept',
        GEAGENDEERD_STATUS_ID
      ); //geagendeerd status
      documentContainer.currentVersion = document;
      yield documentContainer.save();
      treatment.documentContainer = documentContainer;
      yield treatment.save();
    }
    controller.document = document;
  }
}
