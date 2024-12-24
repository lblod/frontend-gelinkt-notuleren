import Component from '@glimmer/component';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { copyStringToClipboard } from '../../utils/copy-string-to-clipboard';
import { on } from '@ember/modifier';
import { task } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import { service } from '@ember/service';
import t from 'ember-intl/helpers/t';

export default class CopyPartsDownloadButton extends Component {
  @service intl;

  get isSuccess() {
    return this.copyToClipboard.last?.isSuccessful;
  }
  get icon() {
    return this.isSuccess ? 'circle-check' : undefined;
  }
  get label() {
    return this.args.translatedLabel ?? this.intl.t(this.args.section.label);
  }

  copyToClipboard = task(async () => {
    await copyStringToClipboard({ html: this.args.section.content.trim() });
  });

  <template>
    <AuButton
      @skin='link'
      @icon={{this.icon}}
      @loading={{this.copyToClipboard.isRunning}}
      @loadingMessage={{t 'copy-options.copying'}}
      class={{if this.isSuccess 'download-meeting-part-downloaded'}}
      {{on 'click' (perform this.copyToClipboard)}}
      ...attributes
    >
      {{#if this.isSuccess}}
        {{t 'copy-options.part-copied' part=this.label}}
      {{else}}
        {{t 'copy-options.copy-part' part=this.label}}
      {{/if}}
    </AuButton>
  </template>
}
