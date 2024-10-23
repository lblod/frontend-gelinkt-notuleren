import Component from '@glimmer/component';
import AuAlert from '@appuniversum/ember-appuniversum/components/au-alert';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import t from 'ember-intl/helpers/t';
import VoPage from 'frontend-gelinkt-notuleren/components/vo-page';

export default class NotFoundWarningComponent extends Component {
  get icon() {
    return this.args.icon ?? 'alert-triangle';
  }

  get skin() {
    return this.args.skin ?? 'warning';
  }

  get title() {
    return this.args.title ?? 'utils.not-found.title';
  }

  <template>
    <VoPage @showBanner={{false}}>
      <section class='au-o-region-large'>
        <div class='au-o-layout'>
          <AuAlert
            @title={{t this.title type=@type}}
            @icon={{this.icon}}
            @skin={{this.skin}}
          >
            {{#if (has-block)}}
              <p>{{yield}}</p>
            {{else}}
              <p>{{t 'utils.not-found.explanation' type=@theType}}</p>
            {{/if}}
            <p>{{t 'utils.not-found.body.contact-message'}}
              <AuLink @route='contact'>{{t
                  'utils.not-found.body.contact-link'
                }}</AuLink>
            </p>
            <p>{{t 'utils.not-found.body.email-message'}}
              <a
                href='mailto:gelinktnotuleren@vlaanderen.be'
                class='au-c-link'
              >{{t 'utils.not-found.body.email'}}</a></p>
          </AuAlert>
        </div>
      </section>
    </VoPage>
  </template>
}
