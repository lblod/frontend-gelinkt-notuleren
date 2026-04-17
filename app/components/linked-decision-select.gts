import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';

import { restartableTask } from 'ember-concurrency';
import AuPill from '@appuniversum/ember-appuniversum/components/au-pill';
import PowerSelect from 'ember-power-select/components/power-select';
import { service } from '@ember/service';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import type { updateLinkedDecisionArgs } from './document-creator/metadata-form';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type BestuursorgaanModel from 'frontend-gelinkt-notuleren/models/bestuursorgaan';
import type { LegacyResourceQuery } from '@ember-data/store/types';
import {
  bindingToObject,
  executeQuery,
  sparqlEscapeString,
  sparqlEscapeUri,
} from 'frontend-gelinkt-notuleren/utils/sparql';
import { DECISION_TYPES_TO_LINK } from 'frontend-gelinkt-notuleren/utils/besluit-types';
import ENV from 'frontend-gelinkt-notuleren/config/environment';
import AuLoader from '@appuniversum/ember-appuniversum/components/au-loader';
import { cached } from '@glimmer/tracking';

interface Sig {
  Args: {
    linkedDecisionUri?: string;
    updateLinkedDecision: (
      linkedDecisionOption: updateLinkedDecisionArgs,
    ) => void;
  };
}

export default class LinkedDecisionSelect extends Component<Sig> {
  @service declare currentSession: CurrentSessionService;
  @service declare store: Store;
  constructor(owner: unknown, args: Sig['Args']) {
    super(owner, args);
  }

  //We need to keep a cached copy of the task run without any searches so the powerselect can always return to this value
  @cached
  get firstPublishedBesluitValue() {
    return this.publishedBesluitsRequest.perform();
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
    if (!this.args.linkedDecisionUri) return;
    return this.publishedBesluits.find(
      (publishedBesluit) =>
        publishedBesluit['uri'] === this.args.linkedDecisionUri,
    );
  }

  searchLinkedDecision = (searchString: string) => {
    return this.publishedBesluitsRequest.perform(searchString);
  };

  <template>
    <AuLabel for='linked-decision'>
      {{t 'document-creator.linked-decision'}}
      <AuPill @size='small' @skin='border'>{{t 'utils.optional'}}</AuPill>
    </AuLabel>
    {{#if this.firstPublishedBesluitValue.isRunning}}
      <AuLoader @hideMessage={{true}}>{{t 'application.loading'}}</AuLoader>
    {{else}}
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
    <p class='au-u-muted au-u-margin-tiny au-u-margin-bottom-small'>
      {{t 'document-creator.linked-decision-helptext'}}
    </p>
  </template>
}
