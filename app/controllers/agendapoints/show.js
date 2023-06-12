import Controller from '@ember/controller';
import { service } from '@ember/service';
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

  copyAgendapunt = task(async () => {
    const response = await fetch(
      `/agendapoint-service/${this.model.documentContainer.id}/copy`,
      { method: 'POST' }
    );
    const json = await response.json();
    const agendapuntId = json.uuid;
    await this.router.transitionTo('agendapoints.edit', agendapuntId);
  });

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }
}
