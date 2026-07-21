import Component from '@glimmer/component';
import AuMainHeader from '@appuniversum/ember-appuniversum/components/au-main-header';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type SessionService from 'frontend-gelinkt-notuleren/services/session';
import { service } from '@ember/service';
import AuDropdown from '@appuniversum/ember-appuniversum/components/au-dropdown';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import t from 'ember-intl/helpers/t';

interface Sig {
  Blocks: {
    returnLink: [];
    actionsAfterTitle: [];
    actions: [];
  };
}

export default class AppChromeComponent extends Component<Sig> {
  @service declare currentSession: CurrentSessionService;
  @service declare session: SessionService;
  get userDisplayName() {
    if (this.currentSession.user) {
      return `${this.currentSession.user.voornaam} ${this.currentSession.user.achternaam}`;
    } else {
      return 'Agent';
    }
  }
  <template>
    <AuMainHeader
      @brandLink='https://www.vlaanderen.be/nl'
      @homeRoute='index'
      @appTitle='Gelinkt Notuleren'
      @contactRoute='contact'
    >
      {{#if this.session.isAuthenticated}}
        <AuDropdown
          @title='{{this.userDisplayName}} - {{this.currentSession.group.classificatie.label}} {{this.currentSession.group.naam}}'
          @buttonLabel='Account settings'
          @alignment='right'
        >
          {{! template-lint-disable require-context-role }}
          <AuLink @route='authorization.switch' @icon='switch' role='menuitem'>
            {{t 'auth.switch-administrative-unit'}}
          </AuLink>
          <AuLink @route='authorization.logout' @icon='logout' role='menuitem'>
            {{t 'auth.logout'}}
          </AuLink>
        </AuDropdown>
      {{else}}
        <AuLink @route='authorization.login' @icon='login'>
          {{t 'auth.login'}}
        </AuLink>
      {{/if}}
    </AuMainHeader>
  </template>
}
