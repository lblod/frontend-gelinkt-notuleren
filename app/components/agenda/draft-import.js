import Component from '@glimmer/component';
import { inject as service } from "@ember/service";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";
import { restartableTask } from "ember-concurrency-decorators";

export default class AgendaDraftImportComponent extends Component {
  constructor(...args){
    super(...args);
    this.getDrafts.perform();
  }
  @service store;
  @tracked options;

  @restartableTask
  * getDrafts(searchParams=''){
    const query={
      include: 'current-version,ontwerp-besluit-status',
      'filter[status][:id:]': 'c02542af-e6be-4cc6-be60-4530477109fc',
      'filter[folder][:id:]': 'ae5feaed-7b70-4533-9417-10fbbc480a4c'
    }
    if(searchParams.length>1){
      query['filter[current-version][title]']=searchParams;
    }
    const containers = yield this.store.query('document-container', query);
    this.options = yield containers.filter(
      e=>e.get('ontwerpBesluitStatus.id')!='7186547b61414095aa2a4affefdcca67' //geagenderred status
    );
    this.args.importedDrafts.forEach(e=>this.options.removeObject(e));
  }

}
