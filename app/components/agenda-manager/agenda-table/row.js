import Component from '@glimmer/component';
import { PUBLISHED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';

export default class AgendaManagerAgendaTableRowComponent extends Component {
  @service store;
  @tracked published = false;

  constructor(...args){
    super(...args);
    this.getAgendaPointStatus.perform();
  }

  @task
  *getAgendaPointStatus(){
    const behandeling=(yield this.store.query("behandeling-van-agendapunt", {
      "filter[onderwerp][:id:]": this.args.item.id,
      include: 'document-container.status'
    })).firstObject;

    if(behandeling){
      const statusId = behandeling.get('documentContainer.status.id');

      if(statusId==PUBLISHED_STATUS_ID){
        this.published=true;
      }
    }
  }
}
