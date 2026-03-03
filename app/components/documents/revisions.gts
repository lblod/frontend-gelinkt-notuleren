import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task } from 'ember-concurrency';
import { service } from '@ember/service';
import AppChrome from 'frontend-gelinkt-notuleren/components/app-chrome';
import type RouterService from '@ember/routing/router-service';
import type IntlService from 'ember-intl/services/intl';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import AuDropdown from '@appuniversum/ember-appuniversum/components/au-dropdown';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { eq } from 'ember-truth-helpers';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import t from 'ember-intl/helpers/t';
import AuMainContainer from '@appuniversum/ember-appuniversum/components/au-main-container';
import humanFriendlyDate from 'frontend-gelinkt-notuleren/helpers/human-friendly-date';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import AuBodyContainer from '@appuniversum/ember-appuniversum/components/au-body-container';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import AuContent from '@appuniversum/ember-appuniversum/components/au-content';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import AgendapointBackLink from 'frontend-gelinkt-notuleren/components/agendapoint-back-link';
import AgendapointMenu from 'frontend-gelinkt-notuleren/components/agendapoint-menu';
import DownloadDocument from 'frontend-gelinkt-notuleren/components/download-document';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';

type Sig = {
  Args: {
    documentContainer: DocumentContainerModel;
    editorDocument: Option<EditorDocumentModel>;
    revisions: Option<EditorDocumentModel[]>;
    returnToMeeting?: ZittingModel;
  };
};

export default class DocumentRevisions extends Component<Sig> {
  @service declare router: RouterService;
  @service declare intl: IntlService;

  @tracked showConfirmationModal = false;
  @tracked revisionToRemove: Option<EditorDocumentModel>;
  @tracked revisionsToRemove: Option<EditorDocumentModel[]>;
  @tracked _revisionDetail?: Option<EditorDocumentModel>;

  get documentContainer() {
    return this.args.documentContainer;
  }

  get editorDocument() {
    return this.args.editorDocument;
  }

  get orderedRevisions() {
    return this.args.revisions ?? [];
  }

  get revisionDetail() {
    return this._revisionDetail ?? this.args.revisions?.[0];
  }

  setNewRevisionHistory = task(
    async (
      revisionsToRemove: EditorDocumentModel[],
      revision: EditorDocumentModel,
    ) => {
      this.documentContainer.set('currentVersion', revision);
      await this.documentContainer.save();
      await Promise.all(revisionsToRemove.map((r) => r.destroyRecord()));
      // this.flushThingsToRemove();
      this.router.transitionTo('agendapoints.edit', this.documentContainer.id);
    },
  );

  getRevisionsToRemove(revision: EditorDocumentModel) {
    const revisionsToRemove: EditorDocumentModel[] = [];

    for (const r of this.orderedRevisions) {
      if (r.id === revision.id) break;
      revisionsToRemove.push(r);
    }

    return revisionsToRemove;
  }

  flushThingsToRemove() {
    this.showConfirmationModal = false;
    this.revisionToRemove = null;
    this.revisionsToRemove = null;
  }

  @action
  cancelConfirmRevisionsToRemove() {
    this.flushThingsToRemove();
  }

  @action
  confirmRevisionsToRemove(revision: EditorDocumentModel) {
    this.showConfirmationModal = true;
    this.revisionsToRemove = this.getRevisionsToRemove(revision);
    this.revisionToRemove = revision;
  }

  @action
  restore() {
    if (this.revisionToRemove && this.revisionsToRemove) {
      this.setNewRevisionHistory
        .perform(this.revisionsToRemove, this.revisionToRemove)
        .catch((err) => {
          console.error('Error restoring version', err);
        });
    }
  }

  @action
  details(revision: EditorDocumentModel) {
    this._revisionDetail = revision;
  }

  <template>
    {{#if this.revisionDetail}}
      <AppChrome
        @editorDocument={{this.revisionDetail}}
        @documentContainer={{this.documentContainer}}
      >
        <:returnLink>
          <AgendapointBackLink @meeting={{@returnToMeeting}} />
        </:returnLink>

        <:actions>
          <AgendapointMenu
            @documentContainer={{this.documentContainer}}
            @meeting={{@returnToMeeting}}
          />
          <AuDropdown @title={{t 'utils.file-options'}} @alignment='right'>
            <DownloadDocument @document={{this.revisionDetail}} />
            <DownloadDocument
              @document={{this.revisionDetail}}
              @forPublish={{true}}
            />
          </AuDropdown>
          <AuButton
            @icon='redo'
            @skin='primary'
            @disabled={{eq this.revisionDetail.id @editorDocument.id}}
            @iconAlignment='left'
            {{on
              'click'
              (fn this.confirmRevisionsToRemove this.revisionDetail)
            }}
          >
            {{t 'agendapoint.restore'}}
          </AuButton>
        </:actions>
      </AppChrome>
      <AuMainContainer class='au-c-app-chrome-container' as |m|>
        <m.sidebar>
          <div class='au-c-sidebar'>
            <div class='au-c-sidebar__header'>
              <h6 class='au-c-heading au-c-heading--6'>
                {{t 'agendapoint.saved-versions'}}
              </h6>
            </div>
            <div class='au-c-sidebar__content'>
              <ul class='au-c-list-navigation'>
                {{#each this.orderedRevisions as |revision|}}
                  <li class='au-c-list-navigation__item'>
                    <AuButton
                      @skin='link'
                      @icon='document'
                      @iconAlignment='left'
                      class='au-c-button--pill au-c-list-navigation__link
                        {{if
                          (eq revision.updatedOn this.revisionDetail.updatedOn)
                          "active"
                        }}'
                      {{on 'click' (fn this.details revision)}}
                    >
                      <span class='au-c-button__text'>
                        {{humanFriendlyDate
                          revision.updatedOn
                          locale=this.intl.primaryLocale
                        }}
                      </span>
                      {{#if (eq revision.id @editorDocument.id)}}
                        <AuPill @size='small' class='au-u-margin-left-tiny'>{{t
                            'agendapoint.current-version'
                          }}</AuPill>
                      {{/if}}
                    </AuButton>
                  </li>
                {{/each}}
              </ul>
            </div>
          </div>
        </m.sidebar>
        <m.content>
          <AuBodyContainer @scroll={{false}}>
            <div class='au-c-rdfa-editor'>
              <div
                class='say-container say-container--sidebar-left say-container--paper'
              >
                <div class='say-container__main'>
                  <div class='say-editor'>
                    <div class='say-editor__paper'>
                      <div class='say-editor__inner say-content'>
                        {{this.revisionDetail.htmlSafeContent}}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </AuBodyContainer>
        </m.content>
      </AuMainContainer>

      <AuModal
        @title={{t 'agendapoint.revisions-modal-title'}}
        @modalOpen={{this.showConfirmationModal}}
        @closeModal={{this.cancelConfirmRevisionsToRemove}}
        as |Modal|
      >
        <Modal.Body>
          <AuContent>
            {{#if this.revisionsToRemove}}
              <p class='u-spacer--small'>{{t 'agendapoint.modify-warning'}}</p>
              <ul class='numbered-list'>
                {{#each this.revisionsToRemove as |revision|}}
                  <li class='u-hr u-padding--bottom--small'>
                    <AuHeading @level='4' @skin='5'>{{t
                        'agendapoint.version-of'
                      }}
                      {{humanFriendlyDate
                        revision.updatedOn
                        locale=this.intl.primaryLocale
                      }}</AuHeading>
                    <p class='au-u-muted'>{{revision.title}}</p>
                  </li>
                {{/each}}
              </ul>
            {{else}}
              <p class='au-u-muted'>{{t 'agendapoint.no-new-versions'}}</p>
            {{/if}}
          </AuContent>
        </Modal.Body>
        <Modal.Footer>
          <AuButtonGroup>
            <AuButton {{on 'click' this.restore}}>{{t
                'agendapoint.restore-version'
              }}</AuButton>
            <AuButton
              @skin='secondary'
              {{on 'click' this.cancelConfirmRevisionsToRemove}}
            >{{t 'participation-list-modal.cancel-button'}}</AuButton>
          </AuButtonGroup>
        </Modal.Footer>
      </AuModal>
    {{/if}}
  </template>
}
