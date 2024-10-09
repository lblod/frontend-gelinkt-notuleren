import Component from '@glimmer/component';
import { service } from '@ember/service';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import { stripHtmlForPublish } from '@lblod/ember-rdfa-editor/utils/strip-html-for-publish';

const PREFIXES = [
  'eli: http://data.europa.eu/eli/ontology#',
  'prov: http://www.w3.org/ns/prov#',
  'mandaat: http://data.vlaanderen.be/ns/mandaat#',
  'besluit: http://data.vlaanderen.be/ns/besluit#',
  'ext: http://mu.semte.ch/vocabularies/ext/',
  'person: http://www.w3.org/ns/person#',
  'persoon: http://data.vlaanderen.be/ns/persoon#',
  'dateplugin: http://say.data.gift/manipulators/insertion/',
  'besluittype: https://data.vlaanderen.be/id/concept/BesluitType/',
  'dct: http://purl.org/dc/terms/',
  'mobiliteit: https://data.vlaanderen.be/ns/mobiliteit#',
  'lblodmow: http://data.lblod.info/vocabularies/mobiliteit/',
];

export default class DownloadMeetingComponent extends Component {
  @service publish;
  @service intl;

  get buttonSkin() {
    return this.args.buttonSkin || 'link';
  }
  get icon() {
    return this.downloadMeeting.last?.isSuccessful
      ? 'circle-check'
      : this.args.icon;
  }
  get loadingText() {
    return (
      this.args.loadingText ?? this.intl.t('download-meeting-part.downloading')
    );
  }
  get completedText() {
    return (
      this.args.completedText || this.intl.t('download-meeting-part.downloaded')
    );
  }

  downloadMeeting = task(async () => {
    let route = `/prepublish/${this.args.documentType}`;
    let html;
    switch (this.args.documentType) {
      case 'agendapunt': {
        html = await this.downloadAgendapoint(this.args.behandeling.id);
        break;
      }
      case 'besluit': {
        html = await this.downloadBesluit(this.args.documentContainer);
        break;
      }
      case 'agenda': {
        html = await this.downloadAgenda(
          this.args.meeting.id,
          this.args.agendaType,
        );
        break;
      }
      default: {
        const json = await this.publish.fetchJobTask.perform(
          `${route}/${this.args.meeting.id}`,
        );
        html = json.data.attributes.content;
        break;
      }
    }
    if (this.args.callback) {
      return this.args.callback(html);
    } else {
      const file = new Blob([html], { type: 'text/html' });
      const linkElement = document.createElement('a');
      linkElement.href = URL.createObjectURL(file);
      linkElement.download = `${this.args.documentType}.html`;
      linkElement.click();
    }
  });
  get buttonText() {
    return (
      this.args.buttonText ??
      this.intl.t(`download.document-download.${this.args.documentType}`)
    );
  }
  async downloadAgenda(meetingId, agendaType) {
    const response = await fetch(
      `/prepublish/agenda/${agendaType}/${meetingId}`,
    );
    const json = await response.json();
    return json.data.attributes.content;
  }
  async downloadAgendapoint(behandelingId) {
    const response = await fetch(`/extract-previews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify({
        data: {
          type: 'extract-previews',
          relationships: {
            treatment: {
              data: {
                id: behandelingId,
              },
            },
          },
        },
      }),
    });
    const json = await response.json();
    return json.data.attributes.html;
  }
  async downloadBesluit(docContainer) {
    const currentVersion = await docContainer.get('currentVersion');
    const content = currentVersion.content;
    const enrichedContent = `
    <div prefix="${PREFIXES.join(' ')}">
      ${stripHtmlForPublish(content)}
    </div>
    `;
    return enrichedContent;
  }
  <template>
    <AuButton
      @skin={{this.buttonSkin}}
      @icon={{this.icon}}
      @loading={{this.downloadMeeting.isRunning}}
      @loadingMessage={{this.loadingText}}
      class={{if this.downloadMeeting.last.isSuccessful 'download-meeting-part-downloaded'}}
      {{on 'click' (perform this.downloadMeeting)}}
    >
      {{#if this.downloadMeeting.last.isSuccessful}}
        {{this.completedText}}
      {{else}}
        {{this.buttonText}}
      {{/if}}
    </AuButton>
  </template>
}
