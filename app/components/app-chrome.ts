import Component from '@glimmer/component';
import { service } from '@ember/service';
import type IntlService from 'ember-intl/services/intl';
import { DRAFT_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import type { PromiseBelongsTo } from '@ember-data/model/-private';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';

interface Sig {
  Args: {
    editorDocument: EditorDocumentModel;
    documentStatus?: ConceptModel;
    documentContainer?: DocumentContainerModel;
    onTitleUpdate?: (title: string) => void;
    allowTitleUpdate?: boolean;
    isRegulatoryStatement?: boolean;
    dirty?: boolean;
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
}
