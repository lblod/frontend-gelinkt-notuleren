import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

import { task } from "ember-concurrency-decorators";

export default class AgendaDraftImportComponent extends Component {
  constructor(...args){
    super(...args);
    this.getDrafts();
  }
  @service store;
  @tracked options;
  @tracked selected;

  @action
  async getDrafts(){
    const containers=await this.store.query('document-container', {
      include: 'current-version,ontwerp-besluit-status',
      'filter[status][:id:]': 'c02542af-e6be-4cc6-be60-4530477109fc',
      'filter[folder][:id:]': 'ae5feaed-7b70-4533-9417-10fbbc480a4c'
    });
    this.options=containers.filter(e=>e.get('ontwerpBesluitStatus.id')!='7186547b61414095aa2a4affefdcca67');//geagenderred status

  }
  @action
  async selectDraft(draft){
    this.selected=draft;
    await this.args.createBehandeling(this.args.agendapunt);
    await this.args.agendapunt.behandeling
    draft.ontwerpBesluitStatus=await this.store.findRecord('concept', '7186547b61414095aa2a4affefdcca67');//geagenderred status
    draft.save
    this.args.agendapunt.behandeling.set('documentContainer', draft);
  }
}
