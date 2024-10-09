import Controller from '@ember/controller';
import { articlesBasedOnClassifcationMap } from 'frontend-gelinkt-notuleren/utils/classification-utils';
import { restartableTask, task } from 'ember-concurrency';
import { trackedTask } from 'reactiveweb/ember-concurrency';
import InstallatieVergaderingModel from 'frontend-gelinkt-notuleren/models/installatievergadering';
import { service } from '@ember/service';

export default class MeetingsDownloadController extends Controller {
  @service publish;
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

  downloadMeeting = task(async () => {
    const json = await this.publish.fetchJobTask.perform(
      `/prepublish/notulen/${this.zitting.id}`,
    );
    const html = json.data.attributes.content;
    this.downloadHtml(html, 'notulen');
  });

  downloadAgenda = task(async () => {
    const response = await fetch(
      `/prepublish/agenda/bdf68a65-ce15-42c8-ae1b-19eeb39e20d0/${this.zitting.id}`,
    );
    const json = await response.json();
    const html = json.data.attributes.content;
    this.downloadHtml(html, 'agenda');
  });

  downloadDecisionlist = task(async () => {
    const json = await this.publish.fetchJobTask.perform(
      `/prepublish/besluitenlijst/${this.zitting.id}`,
    );
    const html = json.data.attributes.content;
    this.downloadHtml(html, 'besluitenlijst');
  });

  downloadHtml(html, documentName) {
    const file = new Blob([html], { type: 'text/html' });
    const linkElement = document.createElement('a');
    linkElement.href = URL.createObjectURL(file);
    linkElement.download = `${documentName}.html`;
    linkElement.click();
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
