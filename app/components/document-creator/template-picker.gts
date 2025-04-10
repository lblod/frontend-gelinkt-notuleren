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
    const favouriteTemplatesString = await this.userPreferences.load(
      'favourite-templates',
    );
    return favouriteTemplatesString
      ? (JSON.parse(favouriteTemplatesString) as string[])
      : [];
  });

  templateSearch = restartableTask(async () => {
    this.error = undefined;
    await timeout(500);

    const abortController = new AbortController();

    try {
      const queryResult = await this.args.getTemplates({
        filter: this.searchText ? { title: this.searchText } : {},
        abortSignal: abortController.signal,
        pagination: { pageNumber: this.pageNumber, pageSize: this.pageSize },
        favourites: this.favouriteTemplates ?? [],
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
    () => [this.inputSearchText, this.pageNumber, this.pageSize],
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
      .save('favourite-templates', JSON.stringify(this.favouriteTemplates))
      .catch((err) => {
        console.error('Error when updating favourite templates', err);
      });
  };

  <template>
    <AuMainContainer class='snippet-modal--main-container' as |mc|>
      <mc.sidebar>
        <div class='au-c-sidebar'>
          <div class='au-c-sidebar__content au-u-padding'>
            <AuHeading @level='3' @skin='4' class='au-u-padding-bottom-small'>
              {{t 'document-creator.selector.filters'}}
            </AuHeading>
            <AuLabel
              class='au-margin-bottom-small'
              for='searchTerm'
              @inline={{false}}
              @required={{false}}
              @error={{false}}
              @warning={{false}}
            >
              {{t 'document-creator.selector.search-field'}}
            </AuLabel>
            <AuNativeInput
              @type='text'
              @width='block'
              id='searchTerm'
              value={{this.searchText}}
              {{on 'input' this.setInputSearchText}}
            />
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
