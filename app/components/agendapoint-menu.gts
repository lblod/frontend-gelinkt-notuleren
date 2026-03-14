import Component from '@glimmer/component';
import { trackedFunction } from 'reactiveweb/function';
import { service } from '@ember/service';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import AttachmentModel from 'frontend-gelinkt-notuleren/models/attachment';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuLink from '@appuniversum/ember-appuniversum/components/au-link';
import t from 'ember-intl/helpers/t';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type ZittingModel from 'frontend-gelinkt-notuleren/models/zitting';

type Sig = {
  Args: {
    attachmentCount?: number;
    documentContainer: DocumentContainerModel;
    editorDocument?: EditorDocumentModel;
    meeting?: ZittingModel;
  };
};

export default class AgendapointMenuComponent extends Component<Sig> {
  @service declare store: StoreService;

  get backRouteName() {
    return this.args.meeting ? 'meetings.edit.agendapoint' : 'agendapoints';
  }

  attachmentCountData = trackedFunction(this, async () => {
    if (this.args.attachmentCount !== undefined) {
      return this.args.attachmentCount;
    }

    const containerId = this.args.documentContainer.id;
    //this has to be here https://github.com/ember-learn/guides-source/issues/1769
    await Promise.resolve();
    const attachmentResult = await this.store.query<AttachmentModel>(
      'attachment',
      {
        'filter[document-container][:id:]': containerId,
        'page[size]': 1,
      },
    );

    return attachmentResult.meta?.['count'] as Option<number>;
  });

  get attachmentCount() {
    return this.attachmentCountData.value ?? 0;
  }

  revisionCountData = trackedFunction(this, async () => {
    const containerId = this.args.documentContainer.id;
    // We use this little hack to ensure the function is running
    if (this.args.editorDocument) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const editorDocument = this.args.editorDocument.id;
    }
    //this has to be here https://github.com/ember-learn/guides-source/issues/1769
    await Promise.resolve();
    const revisionCountData = await this.store.query('editor-document', {
      'filter[document-container][:id:]': containerId,
      'page[size]': 1,
    });

    return revisionCountData.meta?.['count'] as Option<number>;
  });

  get revisionCount() {
    return this.revisionCountData.value ?? 0;
  }

  <template>
    <AuButtonGroup
      @inline={{true}}
      role='tablist'
      aria-label={{t 'editor-tabs'}}
    >
      {{#if @documentContainer}}
        <AuLink
          @route='{{this.backRouteName}}.edit'
          class='au-u-margin-bottom-none'
          @skin='button-secondary'
          @icon='document'
          @iconAlignment='left'
          @model={{@documentContainer.id}}
        >
          {{t 'attachments.return'}}
        </AuLink>
        <AuLink
          @route='{{this.backRouteName}}.attachments'
          class='au-u-margin-bottom-none'
          @skin='button-secondary'
          @icon='attachment'
          @iconAlignment='left'
          @model={{@documentContainer.id}}
        >
          {{t 'attachments.attachments'}}
          {{#if this.attachmentCount}}( {{this.attachmentCount}} ){{/if}}
        </AuLink>
        <AuLink
          @route='{{this.backRouteName}}.revisions'
          class='au-u-margin-bottom-none'
          @skin='button-secondary'
          @icon='draft'
          @iconAlignment='left'
          @model={{@documentContainer.id}}
        >
          {{t 'agendapoint.revisions'}}
          {{#if this.revisionCount}}( {{this.revisionCount}} ){{/if}}
        </AuLink>
      {{/if}}
    </AuButtonGroup>
  </template>
}
