import Component from '@glimmer/component';
import { DRAFT_STATUS_ID, PUBLISHED_STATUS_ID, PLANNED_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import { tracked } from "@glimmer/tracking";
import { task } from "ember-concurrency-decorators";
import { get, action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class AgendaManagerAgendaTableRowComponent extends Component {
  constructor(...args){
    super(...args);
    this.getAgendaPointStatus.perform();
  }

  @service store;

  @tracked published=false;

  @task
  *getAgendaPointStatus(){
    const behandeling=(yield this.store.query("behandeling-van-agendapunt", {
      "filter[onderwerp][:id:]": this.args.item.id,
      include: 'document-container.status'
    })).firstObject;

    const statusId=get(behandeling, "documentContainer.status.id");
    const editorStatus=this.editorStatus(statusId);

    if(editorStatus=="published"){
      this.published=true;
    }
  }

  editorStatus(statusId) {
    if (statusId == DRAFT_STATUS_ID) {
      return "draft";
    }
    else if (statusId == PLANNED_STATUS_ID) {
      return "planned";
    }
    else if (statusId == PUBLISHED_STATUS_ID) {
      return "published";
    }
    else {
      return "unknown";
    }
  }
}
