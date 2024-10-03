import Component from '@glimmer/component';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';

export default class DownloadMeetingComponent extends Component {
  @service publish;
  @service intl;
  @tracked status = 'initial';

  get isCompleted() {
    return this.status === 'completed';
  }
  get isLoading() {
    return this.status === 'loading';
  }
  @action
  async downloadMeeting() {
    this.status = 'loading';
    console.log('download meeting');
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
    this.status = 'completed';
  }
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
    console.log(content);
    return content;
  }
  <template>
    {{#if this.isCompleted}}
      <span
        class='download-meeting-part-downloaded au-u-flex--inline au-u-flex--vertical-center'
      >
        <AuIcon @icon='circle-check' />
        {{t 'download-meeting-part.downloaded'}}
      </span>
    {{else if this.isLoading}}
      <AuLoader @inline='true'>
        {{t 'download-meeting-part.downloading'}}
      </AuLoader>
    {{else}}
      <AuButton
        @skin='link'
        @icon={{@icon}}
        role='menuitem'
        {{on 'click' this.downloadMeeting}}
      >
        {{this.buttonText}}
      </AuButton>
    {{/if}}
  </template>
}
