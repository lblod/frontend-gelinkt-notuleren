import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';

export default class AgendapointsShowController extends Controller {
  @service currentSession;
  @service router;

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  //Not sure if we want this feature
  @task
  *copyAgendapunt() {
    const response = yield fetch(
      `/agendapoint-service/${this.model.documentContainer.id}/copy`,
      { method: 'POST' }
    );
    const json = yield response.json();
    const agendapuntId = json.uuid;
    yield this.router.transitionTo('agendapoints.edit', agendapuntId);
  }

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}