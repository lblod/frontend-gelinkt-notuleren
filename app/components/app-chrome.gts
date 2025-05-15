import Component from '@glimmer/component';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import { get } from '@ember/helper';
import { and, not, or } from 'ember-truth-helpers';
import t from 'ember-intl/helpers/t';
import type { PromiseBelongsTo } from '@ember-data/model/-private';
import AuToolbar from '@appuniversum/ember-appuniversum/components/au-toolbar';
import AuIcon from '@appuniversum/ember-appuniversum/components/au-icon';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import humanFriendlyDate from 'frontend-gelinkt-notuleren/helpers/human-friendly-date';
import LinkedAgendapointsButton from './linked-agendapoints-button';
import EditorStatusPill from './editor-status-pill';
import EditorDocumentTitle from './editor-document-title';

interface Sig {
  Args: {
    editorDocument: EditorDocumentModel;
    documentStatus?: ConceptModel;
    documentContainer?: DocumentContainerModel;
    onTitleUpdate?: (title: string) => void;
    allowTitleUpdate?: boolean;
    isRegulatoryStatement?: boolean;
    dirty?: boolean;
    readOnly?: boolean;
  };
  Blocks: {
    returnLink: [];
    actionsAfterTitle: [];
    actions: [];
  };
}

export default class AppChromeComponent extends Component<Sig> {
  @service declare currentSession: CurrentSessionService;
  @service declare intl: IntlService;

  get documentStatus():
    | PromiseBelongsTo<ConceptModel>
    | ConceptModel
    | undefined {
    const status =
      this.args.documentStatus ?? this.args.documentContainer?.get('status');
    return status;
  }

  get isNotAllowedToTrash() {
    return (
      !this.documentStatus || this.documentStatus.get('id') != DRAFT_STATUS_ID
    );
  }

  <template>
    <nav>
      <div class='au-c-app-chrome'>
        <AuToolbar @size='small' class='au-u-padding-bottom-none' as |Group|>
          <Group>
            {{yield to='returnLink'}}
            <span class='au-c-app-chrome__entity'>{{get
                this.currentSession.group.classificatie
                'label'
              }}
              {{this.currentSession.group.naam}}</span>
          </Group>
          <Group>
            <ul class='au-c-list-horizontal au-u-padding-right-tiny'>
              {{#unless @editorDocument.isNew}}
                {{#if (and @editorDocument.updatedOn (not @dirty))}}
                  <li class='au-c-list-horizontal__item'>
                    <span class='au-c-app-chrome__status'>
                      {{t 'app-chrome.saved-on'}}
                      {{humanFriendlyDate
                        @editorDocument.updatedOn
                        locale=this.intl.primaryLocale
                      }}
                    </span>
                  </li>
                {{else}}
                  <li class='au-c-list-horizontal__item'>
                    <span class='au-c-app-chrome__status'>
                      <AuIcon @icon='alert-triangle' @alignment='left' />
                      {{t 'app-chrome.changes-not-saved'}}
                    </span>
                  </li>
                {{/if}}
              {{/unless}}
            </ul>
          </Group>
        </AuToolbar>
        <AuToolbar @size='small' class='au-u-padding-top-none' as |Group|>
          <Group>
            <div>
              {{#unless @editorDocument.isNew}}
                {{#if @isRegulatoryStatement}}
                  <LinkedAgendapointsButton @document={{@documentContainer}} />
                {{else}}
                  <EditorStatusPill @status={{this.documentStatus}} />
                {{/if}}
              {{/unless}}
              {{#if @editorDocument.isNew}}
                <AuPill @skin='warning'>
                  <AuIcon @icon='alert-triangle' @alignment='left' />
                  {{t 'app-chrome.default-document-status'}}
                </AuPill>
              {{/if}}
            </div>
            <EditorDocumentTitle
              @title={{@editorDocument.title}}
              @readOnly={{or @readOnly (not @allowTitleUpdate)}}
              @onSubmit={{@onTitleUpdate}}
            />
            {{yield to='actionsAfterTitle'}}
          </Group>
          <Group>
            {{yield to='actions'}}
          </Group>
        </AuToolbar>
      </div>
    </nav>
  </template>
}
