import Controller from '@ember/controller';
import { articlesBasedOnClassifcationMap } from '../../utils/classification-utils';
import { restartableTask, trackedTask } from 'ember-concurrency';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';

export default class MeetingsDownloadController extends Controller {
  get zitting() {
    return this.model;
  }
  get agendapoints() {
    return this.zitting.agendapunten;
  }
  get meetingDateForTitle() {
    if (this.zitting?.gestartOpTijdstip) {
      return this.zitting.gestartOpTijdstip;
    } else return this.zitting.geplandeStart;
  }
  get headerArticleTranslationString() {
    return (
      this.meetingDetailsData.value?.headerArticleTranslationString ??
      'meeting-form.meeting-heading-article-ungendered'
    );
  }

  meetingDetailsTask = restartableTask(async () => {
    const bestuursorgaan = await this.zitting.bestuursorgaan;
    const specialisedBestuursorgaan =
      await bestuursorgaan.isTijdsspecialisatieVan;
    const classification = await specialisedBestuursorgaan.classificatie;
    const headerArticleTranslationString =
      articlesBasedOnClassifcationMap[classification.uri];
    return {
      bestuursorgaan,
      headerArticleTranslationString,
    };
  });
  meetingDetailsData = trackedTask(this, this.meetingDetailsTask, () => [
    this.zitting.bestuursorgaan,
  ]);

  get isInaugurationMeeting() {
    return this.zitting instanceof InstallatieVergaderingModel;
  }
}
