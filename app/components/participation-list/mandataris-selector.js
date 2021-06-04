import Component from '@glimmer/component';
import { action } from "@ember/object";
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency';
import { inject as service } from '@ember/service';
import isValidMandateeForMeeting from 'frontend-gelinkt-notuleren/utils/is-valid-mandatee-for-meeting';

export default class ParticipationListMandatarisSelectorComponent extends Component {
  @service store;
  @action
  select(value) {
    this.args.onSelect(value);
  }
  @task
  *searchByName(searchData){
    yield timeout(300);
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      include: 'status',
      'filter[bekleedt][bevat-in][:uri:]': this.args.bestuursorgaan.get('uri'),
      'filter[is-bestuurlijke-alias-van]': searchData,
      page: { size: 100 }
    };
    const mandatees = yield this.store.query('mandataris', queryParams);
    return mandatees.filter((mandatee) => isValidMandateeForMeeting(mandatee, this.args.meeting));
  }
}
