import Component from '@glimmer/component';
import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { generateExportTextFromEditorDocument } from 'frontend-gelinkt-notuleren/utils/generate-export-from-editor-document';
import { copyStringToClipboard } from 'frontend-gelinkt-notuleren/utils/copy-string-to-clipboard';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuMainContainer from '@appuniversum/ember-appuniversum/components/au-main-container';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import DownloadMeetingPart from './download-meeting-part';
import DecisionCopyParts from './decision-copy-parts';
import t from 'ember-intl/helpers/t';
export default class DecisionCopy extends Component {
  @action
  async copyToClipboard(text) {
    await copyStringToClipboard({ html: text });
  }

  get previewDocument() {
    return htmlSafe(
      generateExportTextFromEditorDocument(this.model.document, true),
    );
  }

  <template>
    <div class='au-c-app-chrome'>
      <AuToolbar
        @size='small'
        class='au-u-padding-top-none au-u-padding-bottom-none'
        as |Group|
      >
        <Group>
          {{yield to='links'}}
        </Group>
      </AuToolbar>
    </div>
    <AuMainContainer as |m|>
      <m.content @scroll={{true}}>
        <AuToolbar @size='large' as |Group|>
          <Group>
            <AuHeading @level='1' @skin='2'>
              {{t 'copy-options.heading'}}
              <span
                class='au-c-meeting-chrome__highlight'
              >{{@document.title}}</span>
            </AuHeading>
          </Group>
          <Group>
            <DownloadMeetingPart
              @documentType='besluit'
              @documentContainer={{@container}}
              @buttonText={{t 'copy-options.copy-all'}}
              @loadingText={{t 'copy-options.copying'}}
              @completedText={{t 'copy-options.completed'}}
              @icon='copy-paste'
              @buttonSkin='secondary'
              @callback={{this.copyToClipboard}}
            />
          </Group>
        </AuToolbar>
        <p class='au-u-margin-left au-u-margin-bottom'>{{t
            'copy-options.disclaimer'
          }}</p>
        <div
          class='au-u-flex au-u-flex--column au-u-flex--vertical-center au-u-margin-bottom-large'
        >
          <DecisionCopyParts @decision={{@document}} />
        </div>
      </m.content>
    </AuMainContainer>
  </template>
}
