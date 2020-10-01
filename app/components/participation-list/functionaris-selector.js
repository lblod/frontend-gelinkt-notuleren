import Component from '@glimmer/component';
import { action } from "@ember/object";
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators';

export default class ParticipationListFunctionarisSelectorComponent extends Component {
  @action
  select(value) {
    this.args.onSelect(value);
  }
  @task
  *searchByName(searchData){
    yield timeout(300);
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[bekleedt][bevat-in][:uri:]': this.args.bestuursorgaan.uri,
      'filter[is-bestuurlijke-alias-van][achternaam]': searchData,
      page: { size: 100 }
    };
    return yield this.store.query('functionaris', queryParams);
  }
}
