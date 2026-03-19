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
import { service } from '@ember/service';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import type DocumentContainerModel from 'frontend-gelinkt-notuleren/models/document-container';
import { tracked } from '@glimmer/tracking';
import type { LegacyResourceQuery } from '@ember-data/store/types';
import { restartableTask } from 'ember-concurrency';
import BESLUIT_TYPES from 'frontend-gelinkt-notuleren/utils/besluit-types';
import {
  bindingToObject,
  executeQuery,
  sparqlEscapeString,
  sparqlEscapeUri,
} from 'frontend-gelinkt-notuleren/utils/sparql';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';

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
  @service declare currentSession: CurrentSessionService;
  @tracked searchLinkedDecisionField?: string;
  @tracked firstPublishedBesluitValue;
  constructor(owner: unknown, args: Sig['Args']) {
    super(owner, args);
    this.firstPublishedBesluitValue = this.publishedBesluitsRequest.perform();
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
    const currentAdministrativeUnitId = unwrap(this.currentSession.group?.id);
    const adminUnits = (
      await this.store.countAndFetchAll<BestuursorgaanModel>('bestuursorgaan', {
        'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]':
          currentAdministrativeUnitId,
        include: [
          'is-tijdsspecialisatie-van.bestuurseenheid',
          'is-tijdsspecialisatie-van.classificatie',
        ].join(),
        sort: '-binding-start',
      } as unknown as LegacyResourceQuery<BestuursorgaanModel>)
    ).content as BestuursorgaanModel[];
    const adminUnitUris = adminUnits.map((adminUnit) =>
      adminUnit.uri ? sparqlEscapeUri(adminUnit.uri) : '',
    );
    let searchFilter = '';
    if (searchString) {
      searchFilter = `FILTER(CONTAINS(LCASE(?title), ${sparqlEscapeString(
        searchString.toLowerCase(),
      )}))`;
    }
    const query = `
    PREFIX besluit: <http://data.vlaanderen.be/ns/besluit#>
    PREFIX eli: <http://data.europa.eu/eli/ontology#>
    PREFIX prov: <http://www.w3.org/ns/prov#>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
      SELECT DISTINCT ?uri ?title WHERE {
        ?uri a besluit:Besluit;
          a ?besluitType;
          eli:title ?title.
        ?bvap prov:generated ?uri.
        ?uittreksel ext:uittrekselBvap ?bvap.
        ?zitting ext:uittreksel ?uittreksel;
          besluit:isGehoudenDoor ?adminUnit.
        VALUES ?adminUnit { ${adminUnitUris.join(' ')}}
        VALUES ?besluitType { ${DECISION_TYPES_TO_LINK.map(
          sparqlEscapeUri,
        ).join(' ')}}
        ${searchFilter}
      } LIMIT 20
    `;
    const queryResult = await executeQuery({
      query,
      endpoint: ENV.publicatieEndpoint,
    });
    const besluits = queryResult.results.bindings.map(bindingToObject);
    return besluits;
  });

  get publishedBesluits() {
    return this.firstPublishedBesluitValue?.value || [];
  }
  get selectedPublishedBesluit() {
    if (!this.args.linkedDecision) return;
    return this.publishedBesluits.find(
      (publishedBesluit) =>
        publishedBesluit['uri'] === this.args.linkedDecision?.uri,
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
