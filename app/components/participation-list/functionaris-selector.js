import Component from '@glimmer/component';
import {task} from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

const PROVINCE_CLASSIFICATION_ID = '5ab0e9b8a3b2ca7c5e000000';
const GRIFFIER_CLASSIFICATION_ID = '5ab19107-82d2-4273-a986-3da86fda050d';
const ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID = '39854196-f214-4688-87a1-d6ad12baa2fa';
const ADJUNCT_ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID = '11f0af9e-016c-4e0b-983a-d8bc73804abc';
export default class ParticipationListFunctionarisSelectorComponent extends Component {
  @tracked options = [];

  constructor() {
    super(...arguments);
    this.loadData.perform();
  }

  @service store;
  @service currentSession;

  @task
  *loadData(){
    const group = this.currentSession.group;
    const adminUnitClassification = yield group.classificatie;
    let relevantBestuursOrgaanClassifications = `${ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID},${ADJUNCT_ALGEMEEN_DIRECTEUR_CLASSIFICATION_ID}`;
    if (adminUnitClassification.id === PROVINCE_CLASSIFICATION_ID) {
      relevantBestuursOrgaanClassifications = GRIFFIER_CLASSIFICATION_ID;
    }
    const bestuursorganen = yield this.store.query('bestuursorgaan', {
      filter: {
        "is-tijdsspecialisatie-van": {
          "bestuurseenheid": { ":id:": group.id },
          "classificatie": {":id:": relevantBestuursOrgaanClassifications }
        }
      }
    });
    const startOfMeeting = this.args.meeting.gestartOpTijdstip ? this.args.meeting.gestartOpTijdstip : this.args.meeting.geplandeStart;
    let queryParams = {
      sort: 'is-bestuurlijke-alias-van.achternaam',
      'filter[bekleedt][bevat-in][:id:]': bestuursorganen.map((b) => b.id).join(','),
      'filter[:lte:start]': startOfMeeting.toISOString()
    };
    const candidateOptions = yield this.store.query('functionaris', queryParams);
    this.options = candidateOptions.reject((functionaris) => functionaris.einde && functionaris.einde < startOfMeeting);
  }
}
