import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { trackedFunction } from 'ember-resources/util/function';

export default class AgendaManagerAgendaTableRowComponent extends Component {
  apStatusData = trackedFunction(this, async () => {
    const treatment = await this.args.item.behandeling;
    const container = await treatment.documentContainer;
    const status = await container?.status;
    return status;
  });

  get published() {
    return this.apStatusData.value?.id === PUBLISHED_STATUS_ID;
  }
}
