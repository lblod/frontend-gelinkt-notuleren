import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { restartableTask } from "ember-concurrency-decorators";

export default class AgendaManagerAgendaItemFormSelectDraftComponent extends Component {
  @service store;
  @tracked options;
  @tracked selected;

  constructor(...args){
    super(...args);
    this.getDrafts.perform();
  }

  @restartableTask
  * getDrafts(searchParams=''){
    const query={
      include: 'current-version,status',
      'filter[status][:id:]': 'a1974d071e6a47b69b85313ebdcef9f7',
      'filter[folder][:id:]': 'ae5feaed-7b70-4533-9417-10fbbc480a4c'
    };
    if(searchParams.length>1){
      query['filter[current-version][title]']=searchParams;
    }
    const containers = yield this.store.query('document-container', query);
    this.options = containers;
  }
  @action
  select(value) {
    this.args.model.behandeling.documentContainer = value;
    this.args.model.titel = value.get("currentVersion.title");
  }
}
