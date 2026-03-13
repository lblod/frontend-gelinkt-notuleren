import Component from '@glimmer/component';
import { on } from '@ember/modifier';
import { v4 as uuidv4 } from 'uuid';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuTextarea from '@appuniversum/ember-appuniversum/components/au-textarea';
import BesluitTypeForm from '@lblod/ember-rdfa-editor-lblod-plugins/components/besluit-type-plugin/besluit-type-form';
import RequiredField from '../../components/required-field';
import type { BesluitType } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/fetchBesluitTypes';
import { type BesluitTypeInstance } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/besluit-type-plugin/utils/besluit-type-instances';
import PowerSelect from 'ember-power-select/components/power-select';
import { EDITOR_FOLDERS } from '../../config/constants';
import { service } from '@ember/service';
import { PUBLISHED_STATUS_ID } from '../../utils/constants';
import type Store from '@ember-data/store';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import { tracked } from '@glimmer/tracking';
import type { LegacyResourceQuery } from '@ember-data/store/types';
import { restartableTask } from 'ember-concurrency';
import BESLUIT_TYPES from 'frontend-gelinkt-notuleren/utils/besluit-types';

export type updateLinkedDecisionArgs = {
  documentContainer: DocumentContainerModel;
  title: string;
};

interface Sig {
  Args: {
    title: string;
    invalidTitle?: boolean;
    updateTitle: (title: string) => void;
    selectedType?: BesluitTypeInstance;
    decisionTypes?: BesluitType[];
    setDecisionType?: (selected: BesluitTypeInstance) => void;
    linkedDecision?: DocumentContainerModel;
    updateLinkedDecision: (
      linkedDecisionOption: updateLinkedDecisionArgs,
    ) => void;
  };
}

const DECISION_TYPES_TO_LINK = [
  BESLUIT_TYPES['Reglementen en verordeningen'],
  BESLUIT_TYPES['Rechtspositieregeling (RPR)'],
  BESLUIT_TYPES['Meerjarenplan(aanpassing)'],
  BESLUIT_TYPES['Jaarrekening PEVA'],
  BESLUIT_TYPES['Oprichting autonoom bedrijf'],
  BESLUIT_TYPES['Oprichting of deelname EVA'],
  BESLUIT_TYPES['Oprichting IGS'],
  BESLUIT_TYPES['Oprichting districtsbestuur'],
];

export default class MetadataForm extends Component<Sig> {
  @service declare store: Store;
  @tracked searchLinkedDecisionField?: string;
  constructor(owner: unknown, args: Sig['Args']) {
    super(owner, args);
    void this.publishedBesluitsRequest.perform();
  }
  updateTitle = (event: Event) => {
    if (event.target && 'value' in event.target) {
      this.args.updateTitle(event.target.value as string);
    }
  };
  get isLinkedDecisionType() {
    return (
      this.args.selectedType &&
      DECISION_TYPES_TO_LINK.includes(this.args.selectedType.parent.uri)
    );
  }

  publishedBesluitsRequest = restartableTask(async (searchString?: string) => {
    const options: LegacyResourceQuery<DocumentContainerModel> = {
      include: ['currentVersion'],
      'filter[status][:id:]': `${PUBLISHED_STATUS_ID}`,
      'filter[folder][:id:]': EDITOR_FOLDERS.DECISION_DRAFTS,
    };
    if (searchString) {
      options['filter[current-version][title]'] = searchString;
    }
    const documentContainers = (await this.store.query(
      'document-container',
      options,
    )) as DocumentContainerModel[];

    console.log(documentContainers);
    const simplifiedContainers = await Promise.all(
      documentContainers.map(async (documentContainer) => ({
        documentContainer: documentContainer,
        title: (await documentContainer.currentVersion)?.title,
      })),
    );
    return simplifiedContainers;
  });

  get publishedBesluits() {
    return this.publishedBesluitsRequest.lastSuccessful?.value || [];
  }
  get selectedPublishedBesluit() {
    if (!this.args.linkedDecision) return;
    return this.publishedBesluits.find(
      (publishedBesluit) =>
        publishedBesluit.documentContainer.uri ===
        this.args.linkedDecision?.uri,
    );
  }

  searchLinkedDecision = (searchString: string) => {
    return this.publishedBesluitsRequest.perform(searchString);
  };

  <template>
    <form class='au-o-flow au-u-padding'>
      {{#let (uuidv4) as |id|}}
        <AuLabel @error={{@invalidTitle}} for={{id}}>
          {{t 'document-creator.title-field'}}
          <RequiredField />
        </AuLabel>
        <AuTextarea
          @error={{@invalidTitle}}
          @width='block'
          type='text'
          value={{@title}}
          id={{id}}
          {{on 'input' this.updateTitle}}
        />
      {{/let}}
      {{! The types for ember-truth-helpers 'and' don't seem to work with the types here }}
      {{#if @decisionTypes}}
        {{#if @setDecisionType}}
          <BesluitTypeForm
            @types={{@decisionTypes}}
            @selectedType={{@selectedType}}
            @setType={{@setDecisionType}}
          />
        {{/if}}
      {{/if}}
      {{#if this.isLinkedDecisionType}}
        <AuLabel for='linked-decision'>
          {{t 'document-creator.linked-decision'}}
        </AuLabel>
        <PowerSelect
          id='linked-decision'
          @renderInPlace={{true}}
          @searchEnabled={{true}}
          @searchMessage={{t 'besluit-type-plugin.search-message'}}
          @noMatchesMessage={{t 'besluit-type-plugin.no-matches-message'}}
          @search={{this.searchLinkedDecision}}
          @options={{this.publishedBesluits}}
          @selected={{this.selectedPublishedBesluit}}
          @onChange={{@updateLinkedDecision}}
          as |publishedBesluit|
        >
          {{publishedBesluit.title}}
        </PowerSelect>
      {{/if}}
    </form>
  </template>
}
