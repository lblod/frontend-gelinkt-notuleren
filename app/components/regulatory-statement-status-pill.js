import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import {
  DRAFT_STATUS_ID,
  PUBLISHED_STATUS_ID,
  PLANNED_STATUS_ID,
  ASSIGNED_STATUS_ID,
} from 'frontend-gelinkt-notuleren/utils/constants';

export default class EditorDocumentStatusPillComponent extends Component {
  @tracked status;
  @service store;

  constructor() {
    super(...arguments);
    this.calculateStatus.perform();
  }

  @task
  *calculateStatus() {
    const container = this.args.container;
    if (
      container.currentVersion.get('status') &&
      container.currentVersion.get('status').get('id') === PUBLISHED_STATUS_ID
    ) {
      this.status = container.currentVersion.get('status');
    } else {
      const isPartOf = yield container.isPartOf;
      if (isPartOf && isPartOf.length) {
        const agendapoints = [...isPartOf.toArray()];
        for (let agendapoint of agendapoints) {
          const documentContainer = yield agendapoint.documentContainer;
          const status = yield documentContainer.status;
          if (status.id === PLANNED_STATUS_ID) {
            this.status = status;
            return;
          }
        }
        const assignedStatus = yield this.store.findRecord(
          'concept',
          ASSIGNED_STATUS_ID
        );
        this.status = assignedStatus;
      } else {
        this.status = container.currentVersion.get('status');
      }
    }
  }

  get editorStatusClass() {
    if (!this.status) return '';
    const statusId = this.status.get('id');
    if (statusId == DRAFT_STATUS_ID) {
      return 'border';
    } else if (statusId == PLANNED_STATUS_ID) {
      return 'action';
    } else if (statusId == PUBLISHED_STATUS_ID) {
      return 'success';
    } else {
      return 'border';
    }
  }
}
