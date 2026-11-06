import Component from '@glimmer/component';
import type { SayController } from '@lblod/ember-rdfa-editor';
import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import { getCurrentBesluitRange } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/decision-utils';
import type { LinkedDecisionOption } from './document-creator/metadata-form';
import { DECISION_TYPES_TO_LINK } from 'frontend-gelinkt-notuleren/utils/besluit-types';
import LinkedDecisionSelect from './linked-decision-select';
import setLinkedDecision, {
  extractLinkedDecisionUris,
} from 'frontend-gelinkt-notuleren/utils/setLinkedDecision';
import { task } from 'ember-concurrency';
import DocumentInformationModal from '@lblod/ember-rdfa-editor-lblod-plugins/components/document-information-plugin/document-information-modal';
import type { BesluitTypeInstance } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/besluit-type-instances';
import type { BesluitTypePluginOptions } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin';
import type { BesluitTopicPluginOptions } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-topic-plugin';
import type { BesluitTargetGroupPluginOptions } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-target-group-plugin/_private/types';

type StagedValue<T> = { status: 'unchanged' } | { status: 'staged'; value: T };

type Sig = {
  Args: {
    controller: SayController;
    editorDocument: EditorDocumentModel;
    besluitTypeOptions: BesluitTypePluginOptions;
    besluitTopicOptions: BesluitTopicPluginOptions;
    besluitTargetGroupOptions: BesluitTargetGroupPluginOptions;
    onSave: () => void | Promise<void>;
    onCancel: () => void;
  };
};

export default class AgendapointDocumentInformationModal extends Component<Sig> {
  @tracked stagedLinkedDecision: StagedValue<string | undefined> = {
    status: 'unchanged',
  };
  @tracked stagedDocumentTitle?: string;

  get controller() {
    return this.args.controller;
  }

  get currentBesluitRange() {
    return getCurrentBesluitRange(this.controller);
  }

  get currentDocumentTitle() {
    return this.args.editorDocument.title;
  }

  get selectedDocumentTitle() {
    return this.stagedDocumentTitle ?? this.currentDocumentTitle;
  }

  get hasStagedDocumentTitle() {
    return this.stagedDocumentTitle !== undefined;
  }

  stageDocumentTitle = (event: Event) => {
    this.stagedDocumentTitle = (event.target as HTMLInputElement).value;
  };

  get currentLinkedDecision() {
    if (!this.currentBesluitRange) {
      return;
    }
    return extractLinkedDecisionUris(this.controller.mainEditorState)[0];
  }

  get selectedLinkedDecision() {
    return this.stagedLinkedDecision.status === 'staged'
      ? this.stagedLinkedDecision.value
      : this.currentLinkedDecision;
  }

  get hasStagedLinkedDecision() {
    return this.stagedLinkedDecision.status === 'staged';
  }

  stageLinkedDecision = (linkedDecisionOption?: LinkedDecisionOption) => {
    this.stagedLinkedDecision = {
      status: 'staged',
      value: linkedDecisionOption?.uri,
    };
  };

  showLinkedDecisionField = (selectedTypeInstance?: BesluitTypeInstance) => {
    return (
      selectedTypeInstance &&
      DECISION_TYPES_TO_LINK.includes(selectedTypeInstance.parent.uri)
    );
  };

  updateDocumentLinkedDecision() {
    this.controller.doCommand((state, dispatch) => {
      if (!dispatch) {
        return false;
      }
      const { result, transaction } = setLinkedDecision(
        state,
        this.selectedLinkedDecision,
      );
      if (result.every((ok) => ok)) {
        dispatch(transaction);
        return true;
      }
      return false;
    });
  }

  get disableSave() {
    return !this.selectedDocumentTitle;
  }

  save = task(async () => {
    if (this.hasStagedLinkedDecision) {
      this.updateDocumentLinkedDecision();
    }
    if (this.hasStagedDocumentTitle) {
      this.args.editorDocument.title = this.selectedDocumentTitle;
      await this.args.editorDocument.save();
    }
    await this.args.onSave();
  });

  cancel = () => {
    this.args.onCancel();
  };

  <template>
    <DocumentInformationModal
      @controller={{@controller}}
      @requireBesluitType={{true}}
      @besluitTypeOptions={{@besluitTypeOptions}}
      @besluitTopicOptions={{@besluitTopicOptions}}
      @besluitTargetGroupOptions={{@besluitTargetGroupOptions}}
      @onSave={{this.save.perform}}
      @onCancel={{this.cancel}}
      as |DIM|
    >
      <AuLabel @required={{true}}>
        {{t 'document-information-modal.document-title'}}
      </AuLabel>
      <AuInput
        value={{this.selectedDocumentTitle}}
        class='au-u-margin-bottom-small'
        @width='block'
        {{on 'input' this.stageDocumentTitle}}
      />
      <DIM.BesluitType />
      <DIM.BesluitTopic />
      <DIM.BesluitTargetGroup />
      {{#if (this.showLinkedDecisionField DIM.selectedTypeInstance)}}
        <LinkedDecisionSelect
          @linkedDecisionUri={{this.selectedLinkedDecision}}
          @updateLinkedDecision={{this.stageLinkedDecision}}
        />
      {{/if}}
    </DocumentInformationModal>
  </template>
}
