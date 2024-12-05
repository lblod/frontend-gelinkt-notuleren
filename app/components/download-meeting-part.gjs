import Component from '@glimmer/component';
import { service } from '@ember/service';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import { generateExportTextFromEditorDocument } from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { wrapDownloadedDocument } from 'frontend-gelinkt-notuleren/utils/wrap-downloaded-document';

export default class DownloadMeetingPartComponent extends Component {
  @service publish;
  @service intl;

  get buttonSkin() {
    return this.args.buttonSkin || 'link';
  }
  get icon() {
    return this.downloadMeetingPart.last?.isSuccessful
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

  downloadMeetingPart = task(async () => {
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
      const file = new Blob([wrapDownloadedDocument(html)], {
        type: 'text/html',
      });
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
    return generateExportTextFromEditorDocument(currentVersion, true);
  }
  <template>
    <AuButton
      @skin={{this.buttonSkin}}
      @icon={{this.icon}}
      @loading={{this.downloadMeetingPart.isRunning}}
      @loadingMessage={{this.loadingText}}
      class={{if
        this.downloadMeetingPart.last.isSuccessful
        'download-meeting-part-downloaded'
      }}
      {{on 'click' (perform this.downloadMeetingPart)}}
    >
      {{#if this.downloadMeetingPart.last.isSuccessful}}
        {{this.completedText}}
      {{else}}
        {{this.buttonText}}
      {{/if}}
    </AuButton>
  </template>
}
