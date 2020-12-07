import Component from '@glimmer/component';
import { action } from "@ember/object";
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';


export default class ParticipationListFunctionarisSelectorComponent extends Component {
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @service store;
  @service currentSession;
  @action
  select(value) {
    this.args.onSelect(value);
  }
  @task
  *loadData(){
    const group = yield this.currentSession.group;
    const bestuursorganen = yield this.store.query('bestuursorgaan', {
      filter: {
        "is-tijdsspecialisatie-van": {
          "bestuurseenheid": { ":id:": group.id },
          "classificatie": {":id:": "39854196-f214-4688-87a1-d6ad12baa2fa,11f0af9e-016c-4e0b-983a-d8bc73804abc"}
        }
      }
    });
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[bekleedt][bevat-in][:id:]': bestuursorganen.map((b) => b.id).join(',')
    };
    this.options = yield this.store.query('functionaris', queryParams);
  }
}
