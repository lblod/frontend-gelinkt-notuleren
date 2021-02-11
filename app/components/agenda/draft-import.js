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
      'filter[status][:id:]': 'a1974d071e6a47b69b85313ebdcef9f7',
      'filter[folder][:id:]': 'ae5feaed-7b70-4533-9417-10fbbc480a4c'
    };
    if(searchParams.length>1){
      query['filter[current-version][title]']=searchParams;
    }
    const containers = yield this.store.query('document-container', query);
    this.options = yield containers.filter(
      e=>e.get('status.id')!='7186547b61414095aa2a4affefdcca67' //geagendeerd status
    );
    this.args.importedDrafts.forEach(e=>this.options.removeObject(e));
  }

}
