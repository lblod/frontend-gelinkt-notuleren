import Component from '@glimmer/component';
import type { EditorState, SayController } from '@lblod/ember-rdfa-editor';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { on } from '@ember/modifier';
import AuModal from '@appuniversum/ember-appuniversum/components/au-modal';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import {
  type BesluitTypeInstance,
  checkBesluitTypeInstance,
  mostSpecificBesluitType,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/besluit-type-instances';
import fetchBesluitTypes, {
  type BesluitType,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/fetchBesluitTypes';
import {
  getCurrentBesluitRange,
  getCurrentBesluitURI,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/decision-utils';
import { trackedFunction } from 'reactiveweb/function';
import { setBesluitType } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/set-besluit-type';
import BesluitTypeForm from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-type-plugin/besluit-type-form';
import {
  type BesluitTopic,
  fetchBesluitTopics,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-topic-plugin/utils/fetchBesluitTopics';
import { getOutgoingTripleList } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/namespace';
import { type OutgoingTriple } from '@lblod/ember-rdfa-editor/core/rdfa-processor';
import {
  TOPIC_PREDICATE,
  TOPIC_PREDICATE_DEPRECATED,
  updateBesluitTopicResource,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-topic-plugin/commands/update-besluit-topic-resource';
import BesluitTopicSelect from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-topic-plugin/besluit-topic-select';
import type { updateLinkedDecisionArgs } from './document-creator/metadata-form';
import { DECISION_TYPES_TO_LINK } from 'frontend-gelinkt-notuleren/utils/besluit-types';
import LinkedDecisionSelect from './linked-decision-select';
import setLinkedDecision, {
  extractLinkedDecisionUris,
} from 'frontend-gelinkt-notuleren/utils/setLinkedDecision';
import { modifier } from 'ember-modifier';
import { task, type TaskForAsyncTaskFunction } from 'ember-concurrency';
import perform from 'ember-concurrency/helpers/perform';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';

type Sig = {
  Args: {
    controller: SayController;
    closeModal: () => void;
    editorDocument: EditorDocumentModel;
    classificatieUri: string;
    besluitTypeEndpoint: string;
    besluitTopicEndpoint: string;
    saveTask: TaskForAsyncTaskFunction<unknown, () => Promise<void>>;
  };
};

export default class DocumentInformationModal extends Component<Sig> {
  @tracked selectedTypeInstance?: BesluitTypeInstance;
  @tracked typeChanged = false;
  @tracked besluitTopicsSelected?: BesluitTopic[];
  @tracked topicChanged = false;
  @tracked previousBesluitTopics?: string[];
  @tracked linkedDecisionUri?: string;
  @tracked linkedDecisionChanged = false;
  lastEditorState?: EditorState;
  lastTypesValue?: BesluitType[] | null;
  lastTopicsValue?: BesluitTopic[] | null;
  @tracked documentTitleModified?: string;

  saveChanges = task(async () => {
    if (this.typeChanged) {
      this.updateDocumentBesluitType();
      this.typeChanged = false;
    }
    if (this.topicChanged) {
      this.updateDocumentTopic();
      this.topicChanged = false;
    }
    if (this.linkedDecisionChanged) {
      this.updateDocumentLinkedDecision();
      this.linkedDecisionChanged = false;
    }
    if (this.documentTitleModified) {
      this.args.editorDocument.title = this.documentTitleModified;
      await this.args.editorDocument.save();
      this.documentTitleModified = undefined;
    }
    await this.args.saveTask.perform();
    this.args.closeModal();
  });

  cancelEdit = () => {
    this.selectedTypeInstance = undefined;
    this.typeChanged = false;
    this.besluitTopicsSelected = undefined;
    this.topicChanged = false;
    this.linkedDecisionUri = undefined;
    this.linkedDecisionChanged = false;
    this.args.editorDocument.rollbackAttributes();
    this.args.closeModal();
  };

  updateEditorDocumentTitle = (event: Event) => {
    this.documentTitleModified = (event.target as HTMLInputElement).value;
  };

  get currentDocumentTitle() {
    return this.documentTitleModified || this.args.editorDocument.title;
  }

  get controller() {
    return this.args.controller;
  }

  get currentBesluitRange() {
    return getCurrentBesluitRange(this.controller);
  }

  get selectedType() {
    return (
      this.selectedTypeInstance &&
      mostSpecificBesluitType(this.selectedTypeInstance)
    );
  }

  types = trackedFunction(this, async () => {
    const types = await fetchBesluitTypes(
      this.args.classificatieUri,
      this.args.besluitTypeEndpoint,
    );
    return types;
  });

  get typesSynced() {
    return this.types.value || [];
  }

  updateBesluitTypes = () => {
    if (!this.types.isFinished || !this.currentBesluitRange) {
      return;
    }
    if (!this.types.value) {
      console.warn('Request for besluit types failed');
      return;
    }
    const typeInstance = checkBesluitTypeInstance(
      this.controller.mainEditorState,
      this.types.value,
    );
    if (typeInstance) {
      this.selectedTypeInstance = typeInstance;
    }
  };
  setType = (type: BesluitTypeInstance) => {
    this.selectedTypeInstance = type;
    this.typeChanged = true;
  };

  updateBesluitTopic = () => {
    if (!this.topics.isFinished) {
      return;
    }
    if (!this.topics.value) {
      console.warn('Request for besluit topics failed');
      return;
    }
    const besluitTopics = this.findBesluitTopicsByUris(this.currentTopicUris);
    if (this.currentTopicUris && besluitTopics) {
      this.previousBesluitTopics = this.currentTopicUris;
      this.besluitTopicsSelected = besluitTopics;
    } else {
      this.besluitTopicsSelected = undefined;
    }
  };

  topics = trackedFunction(this, async () => {
    const result = await fetchBesluitTopics({
      config: { endpoint: this.args.besluitTopicEndpoint },
    });
    return result.topics;
  });

  get doc() {
    return this.controller.mainEditorState.doc;
  }

  get currentTopicUris() {
    if (this.currentBesluitRange) {
      const triples: OutgoingTriple[] = this.findTopicTriples(
        this.currentBesluitRange.node.attrs,
      );
      const topicTriples = triples.filter(
        (topic) =>
          topic.object.termType === 'NamedNode' &&
          topic.object.value.includes(
            'https://data.vlaanderen.be/id/concept/BesluitThema/',
          ),
      );
      return topicTriples.map((topic) => topic.object.value);
    } else {
      return [];
    }
  }

  findBesluitTopicsByUris(
    uris: string[],
    topics = this.topics.value,
  ): BesluitTopic[] | undefined {
    if (!uris.length || !topics) return;

    return topics.filter((besluitTopic) => uris.includes(besluitTopic.uri));
  }
  findTopicTriples(attrs?: Record<string, unknown>): OutgoingTriple[] {
    if (!attrs) {
      return [];
    }
    const result = getOutgoingTripleList(attrs, TOPIC_PREDICATE);
    if (result) {
      return result;
    }
    return getOutgoingTripleList(attrs, TOPIC_PREDICATE_DEPRECATED);
  }

  upsertBesluitTopic = (selected: BesluitTopic[]) => {
    this.besluitTopicsSelected = selected;
    this.topicChanged = true;
  };

  get topicsSynced() {
    return this.topics.value || [];
  }

  updateLinkedDecision = (
    linkedDecisionOption: updateLinkedDecisionArgs | null,
  ) => {
    this.linkedDecisionUri = linkedDecisionOption?.uri;
    this.linkedDecisionChanged = true;
  };

  get isLinkedDecisionType() {
    return (
      this.selectedTypeInstance &&
      DECISION_TYPES_TO_LINK.includes(this.selectedTypeInstance.parent.uri)
    );
  }

  updateDocumentBesluitType() {
    this.controller.doCommand((state, dispatch) => {
      if (!this.selectedTypeInstance || !dispatch) {
        return false;
      }
      const { result, transaction } = setBesluitType(
        state,
        this.selectedTypeInstance,
      );
      if (result.every((ok) => ok)) {
        dispatch(transaction);
        return true;
      }
      return false;
    });
  }

  updateDocumentTopic() {
    const resource = getCurrentBesluitURI(this.controller);
    if (resource && this.besluitTopicsSelected) {
      this.controller.doCommand(
        updateBesluitTopicResource({
          resource,
          previousTopics: this.previousBesluitTopics,
          newTopics: this.besluitTopicsSelected,
        }),
        {
          view: this.args.controller.mainEditorView,
        },
      );
    }
  }

  updateDocumentLinkedDecision() {
    this.controller.doCommand((state, dispatch) => {
      if (!dispatch) {
        return false;
      }
      const { result, transaction } = setLinkedDecision(
        state,
        this.linkedDecisionUri,
      );
      if (result.every((ok) => ok)) {
        dispatch(transaction);
        return true;
      }
      return false;
    });
  }

  getLinkedDecisionFromDocument = () => {
    if (!this.currentBesluitRange) {
      return;
    }
    const linkedDecisionUri = extractLinkedDecisionUris(
      this.controller.mainEditorState,
    )[0];
    if (linkedDecisionUri) {
      this.linkedDecisionUri = linkedDecisionUri;
    }
  };

  updateDataModifier = modifier(() => {
    if (
      this.args.controller.mainEditorState !== this.lastEditorState ||
      this.lastTypesValue !== this.types.value
    ) {
      this.updateBesluitTypes();
    }
    if (
      this.args.controller.mainEditorState !== this.lastEditorState ||
      this.lastTopicsValue !== this.topics.value
    ) {
      this.updateBesluitTopic();
    }
    if (this.args.controller.mainEditorState !== this.lastEditorState) {
      this.getLinkedDecisionFromDocument();
    }
    this.lastEditorState = this.args.controller.mainEditorState;
    this.lastTypesValue = this.types.value;
    this.lastTopicsValue = this.topics.value;
  });

  get isMissingRequiredFields() {
    return !this.currentDocumentTitle || !this.selectedTypeInstance;
  }

  <template>
    <div {{this.updateDataModifier}}>
      <AuModal
        @title={{t 'document-information-modal.modal-title'}}
        @modalOpen={{true}}
        @closeModal={{@closeModal}}
        as |Modal|
      >
        <Modal.Body>
          <AuLabel @required={{true}}>
            {{t 'document-information-modal.document-title'}}
          </AuLabel>
          <AuInput
            value={{@editorDocument.title}}
            class='au-u-margin-bottom-small'
            @width='block'
            {{on 'input' this.updateEditorDocumentTitle}}
          />
          {{#if this.types.value}}
            <BesluitTypeForm
              @types={{this.typesSynced}}
              @selectedType={{this.selectedTypeInstance}}
              @setType={{this.setType}}
              @required={{true}}
              @renderInPlace={{false}}
            />
          {{else}}
            <AuLoader @hideMessage={{true}}>{{t
                'application.loading'
              }}</AuLoader>
          {{/if}}
          <AuLabel>
            {{t 'document-information-modal.decision-topic'}}
          </AuLabel>
          {{#if this.topics.value}}
            <BesluitTopicSelect
              @besluitTopics={{this.topicsSynced}}
              @onchange={{this.upsertBesluitTopic}}
              @selected={{this.besluitTopicsSelected}}
              @renderInPlace={{false}}
            />
          {{else}}
            <AuLoader @hideMessage={{true}}>{{t
                'application.loading'
              }}</AuLoader>
          {{/if}}
          {{#if this.isLinkedDecisionType}}
            <LinkedDecisionSelect
              @linkedDecisionUri={{this.linkedDecisionUri}}
              @updateLinkedDecision={{this.updateLinkedDecision}}
            />
          {{/if}}
        </Modal.Body>
        <Modal.Footer>
          <AuButton
            @loading={{this.saveChanges.isRunning}}
            @loadingMessage={{t 'application.loading'}}
            {{on 'click' (perform this.saveChanges)}}
            @disabled={{this.isMissingRequiredFields}}
          >{{t 'document-information-modal.save'}}</AuButton>
          <AuButton
            @skin='secondary'
            @disabled={{this.saveChanges.isRunning}}
            {{on 'click' this.cancelEdit}}
          >{{t 'document-information-modal.cancel'}}</AuButton>
        </Modal.Footer>
      </AuModal>
    </div>
  </template>
}
