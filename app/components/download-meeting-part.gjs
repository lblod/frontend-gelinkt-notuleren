import Component from '@glimmer/component';
import { service } from '@ember/service';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';
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

  downloadMeeting = task(async () => {
    let route = `/prepublish/${this.args.documentType}`;
    let html;
    switch (this.args.documentType) {
      case 'agendapunt': {
        html = await this.downloadAgendapoint(
          this.args.meeting.id,
          this.args.behandeling.id,
        );
        break;
      }
      case 'besluit': {
        html = await this.downloadBesluit(this.args.behandeling);
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
    const file = new Blob([html], { type: 'text/html' });
    const linkElement = document.createElement('a');
    linkElement.href = URL.createObjectURL(file);
    linkElement.download = `${this.args.documentType}.html`;
    linkElement.click();
  });
  get buttonText() {
    return this.intl.t(`download.document-download.${this.args.documentType}`);
  }
  async downloadAgenda(meetingId, agendaType) {
    const response = await fetch(
      `/prepublish/agenda/${agendaType}/${meetingId}`,
    );
    const json = await response.json();
    return json.data.attributes.content;
  }
  async downloadAgendapoint(meetingId, behandelingId) {
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
  async downloadBesluit(behandeling) {
    const documentContainer = await behandeling.get('documentContainer');
    const currentVersion = await documentContainer.currentVersion;
    const content = currentVersion.content;
    const enrichedContent = `
    <div prefix="${PREFIXES.join(' ')}">
      ${stripHtmlForPublish(content)}
    </div>
    `;
    return enrichedContent;
  }
  <template>
    {{#if this.downloadMeeting.last.isSuccessful}}
      <span
        class='download-meeting-part-downloaded au-u-flex--inline au-u-flex--vertical-center'
      >
        <AuIcon @icon='circle-check' />
        {{t 'download-meeting-part.downloaded'}}
      </span>
    {{else if this.downloadMeeting.isRunning}}
      <AuLoader @inline='true'>
        {{t 'download-meeting-part.downloading'}}
      </AuLoader>
    {{else}}
      <AuButton
        @skin='link'
        @icon={{@icon}}
        {{on 'click' (perform this.downloadMeeting)}}
      >
        {{this.buttonText}}
      </AuButton>
    {{/if}}
  </template>
}
