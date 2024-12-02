import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import Component from '@glimmer/component';
import config from 'frontend-gelinkt-notuleren/config/environment';

export default class GlobalSystemNotification extends Component {
  get notification() {
    console.log('Not: ', config.globalSystemNotification);
    return config.globalSystemNotification;
  }

  get show() {
    if (!this.notification) {
      return false;
    }
    if (this.notification.startsWith('{{')) {
      return false;
    }
    return true;
  }

  <template>
    {{#if this.show}}
      <AuAlert
        @skin='warning'
        @size='tiny'
        @closable={{true}}
        class='au-u-margin-bottom-none'
        ...attributes
      >
        <p class='au-u-text-center'>
          {{!template-lint-disable no-triple-curlies}}
          {{{this.notification}}}
        </p>
      </AuAlert>
    {{/if}}
  </template>
}
