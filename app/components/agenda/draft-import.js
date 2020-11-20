import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { task } from "ember-concurrency-decorators";

export default class AgendaDraftImportComponent extends Component {
  constructor(...args){
    super(...args);
    this.getDrafts();
    this.getCurrentDraft();
  }
  @service store;
  @tracked options;
  @tracked selected;

  @action
  async getCurrentDraft(){
    const behandeling=await this.args.agendapunt.behandelingVanAgendapunt;

    if(behandeling){
      const container=await behandeling.documentContainer;
    }
    else{
      this.args.createBehandeling(this.args.createBehandeling)
    }
  }
  @action
  async getDrafts(){
    const containers=await this.store.query('document-container', {
      include: 'current-version,ontwerp-besluit-status',
      'filter[status][:id:]': 'c02542af-e6be-4cc6-be60-4530477109fc',
      'filter[folder][:id:]': 'ae5feaed-7b70-4533-9417-10fbbc480a4c'
    });
    const filteredContainers=containers.filter(e=>e.get('ontwerpBesluitStatus.id')!='7186547b61414095aa2a4affefdcca67');
    this.options=filteredContainers.map(e=>e.get('currentVersion'));
  }
  @action
  selectDraft(draft){
    this.selected=draft;

  }
}
