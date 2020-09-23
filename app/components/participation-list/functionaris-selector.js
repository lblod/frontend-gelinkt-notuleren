import Component from '@glimmer/component';
import { action } from "@ember/object";
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators'

export default class ParticipationListFunctionarisSelectorComponent extends Component {
  @action
  select() {

  }
  @task
  *searchByName(){
    yield timeout(300);
    const bestuurseenheid = yield this.args.bestuursorgaan.get('bestuurseenheid')
    console.log(bestuurseenheid.uri)
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[bekleedt][bevat-in][is-tijdsspecialisatie-van][bestuurseenheid][:uri:]': bestuurseenheid.uri,
      'filter[is-bestuurlijke-alias-van][achternaam]': searchData,
      page: { size: 100 }
    };
    return yield this.store.query('functionaris', queryParams);
  }
}
