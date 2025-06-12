import { service } from '@ember/service';
import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';
import { trackedFunction } from 'reactiveweb/function';
import {
  BESTUURSEENHEID_CLASSIFICATIE_CODES,
  BESTUURSPERIODES,
  IV_CLASSIFICATIE_MAP,
} from '../../config/constants';

export default class InboxMeetingsController extends Controller {
  @service store;
  @service currentSession;
  @service router;
  @service features;

  sort = '-geplande-start';
  @tracked debounceTime = 2000;
  @tracked page = 0;
  @tracked pageSize = 20;

  get readOnly() {
    return !this.currentSession.canWrite && this.currentSession.canRead;
  }

  isInaugurationMeeting = (meeting) => {
    return meeting instanceof InstallatieVergaderingModel;
  };

  mayCreateInaugurationMeeting = trackedFunction(this, async () => {
    if (this.readOnly || !this.features.isEnabled('inauguration-meeting')) {
      return false;
    }
    const unitClass = await this.currentSession.group.classificatie;

    // We only support IVs for gemeentes, districten and OCMWs
    if (
      ![
        BESTUURSEENHEID_CLASSIFICATIE_CODES.GEMEENTE,
        BESTUURSEENHEID_CLASSIFICATIE_CODES.DISTRICT,
        BESTUURSEENHEID_CLASSIFICATIE_CODES.OCMW,
      ].includes(unitClass.uri)
    ) {
      return false;
    }

    // We check if the logged-in 'bestuurseenheid' has a 'bestuursorgaan' in the new legislation
    const isRelevant = Boolean(
      await this.store.count('bestuursorgaan', {
        filter: {
          bestuursperiode: {
            ':uri:': BESTUURSPERIODES['2024-heden'],
          },
          'is-tijdsspecialisatie-van': {
            bestuurseenheid: {
              id: this.currentSession.group.id,
            },
            classificatie: {
              ':uri:': IV_CLASSIFICATIE_MAP[unitClass.uri],
            },
          },
        },
      }),
    );
    return isRelevant;
  });
}
