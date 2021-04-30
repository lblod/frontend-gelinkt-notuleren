import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { restartableTask } from "ember-concurrency-decorators";

const DRAFT_STATUS_ID = "a1974d071e6a47b69b85313ebdcef9f7";
const FOLDER_ID = "ae5feaed-7b70-4533-9417-10fbbc480a4c";

export default class AgendaManagerAgendaItemFormSelectDraftComponent extends Component {
  @service store;
  @tracked options;
  @tracked selected;

  constructor(...args){
    super(...args);
    this.getDrafts.perform();
  }

  get agendaItem() {
    return this.args.model;
  }

  @restartableTask
  * getDrafts(searchParams=''){
    const query={
      include: 'current-version,status',
      'filter[status][:id:]': DRAFT_STATUS_ID,
      'filter[folder][:id:]': FOLDER_ID,
    };
    if(searchParams.length>1){
      query['filter[current-version][title]']=searchParams;
    }
    const containers = yield this.store.query('document-container', query);
    this.options = containers;
  }

  @action
  select(draft) {
    this.selected = draft;
    this.agendaItem.set("behandeling.documentContainer", draft);
    if (draft) {
      this.agendaItem.titel = draft.get("currentVersion.title");
    } else {
      this.agendaItem.titel = '';
    }
  }
}
