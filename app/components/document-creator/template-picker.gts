import pagination from '@lblod/ember-rdfa-editor-lblod-plugins/helpers/pagination';
import Component from '@glimmer/component';
import { assert } from '@ember/debug';
import { service } from '@ember/service';
import { restartableTask, timeout } from 'ember-concurrency';
import { task as trackedTask } from 'reactiveweb/ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';
import t from 'ember-intl/helpers/t';
import { not } from 'ember-truth-helpers';
import AuMainContainer from '@appuniversum/ember-appuniversum/components/au-main-container';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';

import AuNativeInput from '@lblod/ember-rdfa-editor-lblod-plugins/components/au-native-input';
import Loading from '@lblod/ember-rdfa-editor-lblod-plugins/components/common/search/loading';
import AlertLoadError from '@lblod/ember-rdfa-editor-lblod-plugins/components/common/search/alert-load-error';
import PreviewList from '@lblod/ember-rdfa-editor-lblod-plugins/components/common/documents/preview-list';
import AlertNoItems from '@lblod/ember-rdfa-editor-lblod-plugins/components/common/search/alert-no-items';
import PaginationView from '@lblod/ember-rdfa-editor-lblod-plugins/components/pagination/pagination-view';
import { type PreviewableDocument } from '@lblod/ember-rdfa-editor-lblod-plugins/components/common/documents/types';
import type CurrentSessionService from 'frontend-gelinkt-notuleren/services/current-session';
import { type Template } from 'frontend-gelinkt-notuleren/services/template-fetcher';
import { type Option } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';
import type UserPreferencesService from 'frontend-gelinkt-notuleren/services/user-preferences';
import { trackedFunction } from 'reactiveweb/function';
import { localCopy } from 'tracked-toolbox';
import TagSelector from '@lblod/ember-rdfa-editor-lblod-plugins/components/common/tags/tag-selector';
import { RESOURCE_TYPES } from 'frontend-gelinkt-notuleren/utils/constants';
import { getOwner } from '@ember/owner';
import { type InternalOwner } from '@ember/-internals/owner';
import { type Environment } from 'frontend-gelinkt-notuleren/config/environment';
import type { Tag } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/common/tags/types';
import {
  executeQuery,
  type BindingObject,
} from 'frontend-gelinkt-notuleren/utils/sparql';

class PreviewableTemplate implements PreviewableDocument {
  title: string;
  original: Template;
  contentPromise: Promise<string | null>;
  contentResolve?: (content: string | null) => void;
  loadStarted = false;

  constructor(template: Template) {
    this.original = template;
    this.title = template.title;
    this.contentPromise = new Promise<string | null>((resolve) => {
      this.contentResolve = resolve;
    });
  }

  get content() {
    if (!this.loadStarted) {
      this.loadStarted = true;
      (this.original.loadBody ?? (() => Promise.resolve()))()
        ?.then(() => {
          this.contentResolve?.(this.original.body);
        })
        .catch((err) => {
          console.error(
            'Error when trying to load template preview',
            this.title,
            err,
          );
          this.contentResolve?.(null);
        });
    }
    return this.contentPromise;
  }
}

export type GetTemplates = (args: {
  filter: object;
  abortSignal: AbortSignal;
  favourites: Option<string[]>;
  pagination: {
    pageNumber: number;
    pageSize: number;
  };
}) => Promise<{ totalCount: number; results: Template[] }>;

interface Sig {
  Args: {
    getTemplates: GetTemplates;
    onSelect: (doc: Template) => void;
  };
}

export default class TemplatePicker extends Component<Sig> {
  @service declare currentSession: CurrentSessionService;
  @service declare userPreferences: UserPreferencesService;
  // Filtering
  @tracked inputSearchText: string | null = null;
  @tracked selectedTags: Tag[] = [];

  // Favourite templates
  @localCopy('favouriteTemplatesQuery.value') favouriteTemplates?: string[];

  // Display
  @tracked error: Error | undefined;

  // Pagination
  @tracked pageNumber = 0;
  @tracked pageSize = 20;
  @tracked totalCount = 0;

  get searchText() {
    return this.inputSearchText;
  }

  setInputSearchText = (event: Event) => {
    assert(
      'inputSearchText must be bound to an input element',
      event.target instanceof HTMLInputElement,
    );

    this.inputSearchText = event.target.value;
  };

  favouriteTemplatesQuery = trackedFunction(this, async () => {
    try {
      const favouriteTemplates = await this.userPreferences.load(
        'favourite-templates',
      );
      return favouriteTemplates;
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  templateSearch = restartableTask(async () => {
    this.error = undefined;
    await timeout(500);

    const abortController = new AbortController();

    try {
      const favouriteTemplates = await this.favouriteTemplatesQuery.promise;
      const filter = {
        ...(this.searchText ? { title: this.searchText } : {}),
        ...(this.selectedTags.length > 0 ? { tags: this.selectedTags } : {}),
      };

      const queryResult = await this.args.getTemplates({
        filter,
        abortSignal: abortController.signal,
        pagination: { pageNumber: this.pageNumber, pageSize: this.pageSize },
        favourites: favouriteTemplates,
      });

      this.totalCount = queryResult.totalCount;

      return queryResult.results.map(
        (template) => new PreviewableTemplate(template),
      );
    } catch (error) {
      this.error = error as Error;
      return [];
    } finally {
      abortController.abort();
    }
  });

  onSelect = (template: PreviewableTemplate) => {
    return this.args.onSelect(template.original);
  };

  templateResource = trackedTask<PreviewableTemplate[]>(
    this,
    this.templateSearch,
    () => [
      this.inputSearchText,
      this.pageNumber,
      this.pageSize,
      this.selectedTags,
    ],
  );

  previousPage = () => {
    --this.pageNumber;
  };

  nextPage = () => {
    ++this.pageNumber;
  };

  isFavouriteTemplate = (template: PreviewableTemplate) =>
    this.favouriteTemplates?.includes(template.original.uri) ?? false;

  toggleFavouriteTemplate = (template: PreviewableTemplate) => {
    let newFavouriteTemplates = this.favouriteTemplates?.slice() ?? [];
    if (newFavouriteTemplates.includes(template.original.uri)) {
      newFavouriteTemplates = newFavouriteTemplates.filter(
        (fav) => fav !== template.original.uri,
      );
    } else {
      newFavouriteTemplates.push(template.original.uri);
    }

    this.favouriteTemplates = newFavouriteTemplates;

    this.userPreferences
      .save('favourite-templates', this.favouriteTemplates)
      .catch((err) => {
        console.error('Error when updating favourite templates', err);
      });
  };

  changeTagsFilter = (tags: Tag[]) => {
    this.selectedTags = tags;
  };

  tags = trackedFunction(this, async () => {
    const config = (
      getOwner(this) as InternalOwner | undefined
    )?.resolveRegistration('config:environment') as Environment;
    const sparqlEndpoint = config.regulatoryStatementEndpoint;
    const query = /* sparql */ `
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX gn: <http://data.lblod.info/vocabularies/gelinktnotuleren/>
    PREFIX ext: <http://mu.semte.ch/vocabularies/ext/>
    PREFIX pav: <http://purl.org/pav/>
    PREFIX schema: <http://schema.org/>

    SELECT DISTINCT ?tag ?value WHERE {
      ?tag a gn:Tag;
        skos:prefLabel ?value.
      ?templateInfo a <${RESOURCE_TYPES.TEMPLATE_INFO}> ;
        ext:hasTag ?tag.
      ?publishedTemplate a gn:Template ;
        pav:hasCurrentVersion ?templateVersion ;
        ext:templateInfo ?templateInfo .
      
      OPTIONAL {
        ?templateVersion schema:validThrough ?validThrough .
      }

      FILTER( ! BOUND(?validThrough) || ?validThrough > NOW())
    }
    ORDER BY ?value
    `;

    const results = await executeQuery<
      BindingObject<{ tag: string; value: string }>
    >({
      endpoint: sparqlEndpoint,
      query,
    });

    return results.results.bindings.map((binding) => ({
      uri: binding.tag.value,
      value: binding.value.value,
    }));
  });

  <template>
    <AuMainContainer class='snippet-modal--main-container' as |mc|>
      <mc.sidebar>
        <div class='au-c-sidebar'>
          <div class='au-c-sidebar__content au-u-padding'>
            <AuHeading @level='3' @skin='4' class='au-u-padding-bottom-small'>
              {{t 'document-creator.selector.filters'}}
            </AuHeading>
            <div class='au-c-form'>
              <AuFormRow>
                <AuLabel class='au-margin-bottom-small' for='searchTerm'>
                  {{t 'document-creator.selector.search-field'}}
                </AuLabel>
                <AuNativeInput
                  @type='text'
                  @width='block'
                  id='searchTerm'
                  value={{this.searchText}}
                  {{on 'input' this.setInputSearchText}}
                />
              </AuFormRow>
              <AuFormRow>
                <AuLabel class='au-margin-bottom-small' for='searchTerm'>
                  {{t 'document-creator.selector.tags'}}
                </AuLabel>
                {{#unless this.tags.isLoading}}
                  {{#if this.tags.value}}
                    <TagSelector
                      @onChange={{this.changeTagsFilter}}
                      @tags={{this.tags.value}}
                      @selectedTags={{this.selectedTags}}
                    />
                  {{/if}}
                {{/unless}}
              </AuFormRow>
            </div>
          </div>
        </div>
      </mc.sidebar>
      <mc.content @scroll={{true}}>
        <div class='au-u-padding-top snippet-modal--list-container'>
          {{#if this.templateResource.isRunning}}
            <div class='au-u-margin'>
              <Loading />
            </div>
          {{else}}
            {{#if this.error}}
              <AlertLoadError @error={{this.error}} />
            {{else}}
              {{#if this.templateResource.value.length}}
                <PreviewList
                  @docs={{this.templateResource.value}}
                  @onInsert={{this.onSelect}}
                  @isFavourite={{this.isFavouriteTemplate}}
                  @toggleFavourite={{this.toggleFavouriteTemplate}}
                />
              {{else}}
                <AlertNoItems />
              {{/if}}
            {{/if}}
          {{/if}}
        </div>
        {{#if this.templateResource.value.length}}
          {{#let
            (pagination
              page=this.pageNumber pageSize=this.pageSize count=this.totalCount
            )
            as |pg|
          }}
            <PaginationView
              @totalCount={{pg.count}}
              @rangeStart={{pg.pageStart}}
              @rangeEnd={{pg.pageEnd}}
              @onNextPage={{this.nextPage}}
              @onPreviousPage={{this.previousPage}}
              @isFirstPage={{not pg.hasPreviousPage}}
              @isLastPage={{not pg.hasNextPage}}
            />
          {{/let}}
        {{/if}}
      </mc.content>
    </AuMainContainer>
  </template>
}
