import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { task } from "ember-concurrency-decorators";
import generateExportFromEditorDocument from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { action } from '@ember/object';

export default class AgendapointsShowController extends Controller {
  @service currentSession;

  @action
  download() {
    generateExportFromEditorDocument(this.model.editorDocument);
  }

  @task
  *copyAgendapunt() {
    const response = yield fetch(`/agendapoint-service/${this.model.documentContainer.id}/copy`, {method: 'POST'});
    const json = yield response.json();
    const agendapuntId = json.uuid;
    yield this.transitionToRoute('agendapoints.edit', agendapuntId);
  }

  get readOnly(){
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
