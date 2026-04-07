import Component from '@glimmer/component';
import type { SayController } from '@lblod/ember-rdfa-editor';
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
import fetchBesluitTypes from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/fetchBesluitTypes';
import {
  getCurrentBesluitRange,
  getCurrentBesluitURI,
} from '@lblod/ember-rdfa-editor-lblod-plugins/utils/decision-utils';
import { trackedFunction } from 'reactiveweb/function';
import { setBesluitType } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/set-besluit-type';
import BesluitTypeForm from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-type-plugin/besluit-type-form';
import didUpdate from '@ember/render-modifiers/modifiers/did-update';
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
import setLinkedDecision from 'frontend-gelinkt-notuleren/utils/setLinkedDecision';

type Sig = {
  Args: {
    controller: SayController;
    closeModal: () => void;
    editorDocument: EditorDocumentModel;
    classificatieUri: string;
    besluitTypeEndpoint: string;
    besluitTopicEndpoint: string;
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

  updateEditorDocumentTitle = (event: Event) => {
    this.args.editorDocument.title = (event.target as HTMLInputElement).value;
  };
  saveChanges = () => {
    if (this.typeChanged) {
      this.updateDocumentBesluitType();
    }
    if (this.topicChanged) {
      this.updateDocumentTopic();
    }
    if (this.linkedDecisionChanged) {
      this.updateDocumentLinkedDecision();
    }
    this.typeChanged = false;
    this.topicChanged = false;
    this.linkedDecisionChanged = false;
    this.args.closeModal();
  };
  cancelEdit = () => {
    this.selectedTypeInstance = undefined;
    this.typeChanged = false;
    this.besluitTopicsSelected = undefined;
    this.topicChanged = false;
    this.linkedDecisionUri = undefined;
    this.linkedDecisionChanged = false;
    this.args.closeModal();
  };
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
  matchTopicPredicate = (predicate: string): boolean => {
    const newMatch = TOPIC_PREDICATE.matches(predicate);
    if (newMatch) {
      return newMatch;
    }
    return TOPIC_PREDICATE_DEPRECATED.matches(predicate);
  };

  upsertBesluitTopic = (selected: BesluitTopic[]) => {
    this.besluitTopicsSelected = selected;
    this.topicChanged = true;
  };

  get topicsSynced() {
    return this.topics.value || [];
  }

  updateLinkedDecision = (linkedDecisionOption: updateLinkedDecisionArgs) => {
    this.linkedDecisionUri = linkedDecisionOption.uri;
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
    if (this.linkedDecisionUri) {
      this.controller.doCommand((state, dispatch) => {
        if (!this.selectedTypeInstance || !dispatch) {
          return false;
        }
        const { result, transaction } = setLinkedDecision(
          state,
          this.linkedDecisionUri as string,
        );
        if (result.every((ok) => ok)) {
          dispatch(transaction);
          return true;
        }
        return false;
      });
    }
  }

  <template>
    <div
      {{didUpdate this.updateBesluitTypes @controller.mainEditorState}}
      {{didUpdate this.updateBesluitTypes this.types.value}}
      {{didUpdate this.updateBesluitTopic @controller.mainEditorState}}
      {{didUpdate this.updateBesluitTopic this.topics.value}}
    >
      <AuModal
        @title='Edit document information'
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
            {{on 'input' this.updateEditorDocumentTitle}}
          />
          <BesluitTypeForm
            @types={{this.typesSynced}}
            @selectedType={{this.selectedTypeInstance}}
            @setType={{this.setType}}
          />
          <BesluitTopicSelect
            @besluitTopics={{this.topicsSynced}}
            @onchange={{this.upsertBesluitTopic}}
            @selected={{this.besluitTopicsSelected}}
          />
          {{#if this.isLinkedDecisionType}}
            <LinkedDecisionSelect
              @linkedDecisionUri={{this.linkedDecisionUri}}
              @updateLinkedDecision={{this.updateLinkedDecision}}
            />
          {{/if}}
        </Modal.Body>
        <Modal.Footer>
          <AuButton {{on 'click' this.saveChanges}}>{{t
              'document-information-modal.save'
            }}</AuButton>
          <AuButton @skin='secondary' {{on 'click' this.cancelEdit}}>{{t
              'document-information-modal.cancel'
            }}</AuButton>
        </Modal.Footer>
      </AuModal>
    </div>
  </template>
}
