import Component from '@glimmer/component';
import type { AuMainContainerSignature } from '@appuniversum/ember-appuniversum/components/au-main-container';
import ReactiveTable from 'frontend-gelinkt-notuleren/components/common/reactive-table';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { VisibleIcon } from '@appuniversum/ember-appuniversum/components/icons/visible';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { restartableTask, timeout } from 'ember-concurrency';
import { trackedTask } from 'reactiveweb/ember-concurrency';
import AuFormRow from '@appuniversum/ember-appuniversum/components/au-form-row';
import AuLabel from '@appuniversum/ember-appuniversum/components/au-label';
import AuHeading from '@appuniversum/ember-appuniversum/components/au-heading';
import AuInput from '@appuniversum/ember-appuniversum/components/au-input';
import { v4 as uuidv4 } from 'uuid';
import { CrossIcon } from '@appuniversum/ember-appuniversum/components/icons/cross';
import { detailedDate } from 'frontend-gelinkt-notuleren/utils/detailed-date';
import type ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import t from 'ember-intl/helpers/t';

const FILTER_TIMEOUT_MS = 300;

export type ArDesignOverviewSortField = 'name' | '-name' | 'date' | '-date';
export type ArDesignOverviewSignature = {
  Element: AuMainContainerSignature['Element'];
  Args: {
    onShowPreview: (arDesign: ArDesign) => void;
    onInsertAr: (arDesign: ArDesign) => void;
  };
};

export default class ArDesignOverview extends Component<ArDesignOverviewSignature> {
  @service declare store: Store;

  @tracked pageNumber: number = 0;
  pageSize: number = 20;
  @tracked sort?: ArDesignOverviewSortField = 'date';
  @tracked nameFilter = '';

  setNameFilter = (event: Event) => {
    if (event.target && 'value' in event.target) {
      this.nameFilter = event.target.value as string;
    }
  };
  resetFilters = () => {
    this.nameFilter = '';
  };

  arDesignsQuery = restartableTask(async () => {
    await timeout(FILTER_TIMEOUT_MS);
    const { pageNumber, pageSize, sort, nameFilter } = this;
    try {
      const designs = await this.store.query<ArDesign>('ar-design', {
        ...(nameFilter && {
          filter: {
            name: nameFilter,
          },
        }),
        page: {
          size: pageSize,
          number: pageNumber,
        },
        sort,
      });
      return designs;
    } catch (e) {
      console.error(e);
      throw e;
    }
  });
  arDesigns = trackedTask<ArDesign[]>(this, this.arDesignsQuery, () => [
    this.pageNumber,
    this.pageSize,
    this.sort,
    this.nameFilter,
  ]);

  updateSort = (sort?: ArDesignOverviewSortField) => {
    this.sort = sort;
    this.resetPagination();
  };

  resetPagination = () => {
    this.updatePageNumber(0);
  };

  updatePageNumber = (pageNumber: number) => {
    this.pageNumber = pageNumber;
  };

  <template>
    <div class='ar-importer-overview' ...attributes>
      <div class='ar-importer-overview__sidebar'>
        <AuHeading @level='2' @skin='3'>{{t
            'ar-importer.overview.filters.title'
          }}</AuHeading>
        <form class='ar-importer-overview__form'>
          <AuFormRow>
            {{#let (uuidv4) as |id|}}
              <AuLabel class='ar-importer-overview__form__label' for={{id}}>
                {{t 'ar-importer.overview.filters.name.label'}}
              </AuLabel>
              <AuInput
                id={{id}}
                @width='block'
                value={{this.nameFilter}}
                {{on 'input' this.setNameFilter}}
              />
            {{/let}}
          </AuFormRow>
          <AuButton
            class='ar-importer-overview__reset-filters-button'
            @skin='naked'
            @size='large'
            @icon={{CrossIcon}}
            {{on 'click' this.resetFilters}}
          >{{t 'ar-importer.overview.filters.reset'}}</AuButton>
        </form>
      </div>
      <div class='ar-importer-overview__content'>
        <ReactiveTable
          @content={{this.arDesigns.value}}
          @isLoading={{this.arDesigns.isRunning}}
          @page={{this.pageNumber}}
          @pageSize={{this.pageSize}}
          @onPageChange={{this.updatePageNumber}}
          @onSortChange={{this.updateSort}}
          @sort={{this.sort}}
          @noDataMessage={{t 'ar-importer.overview.table.no-data'}}
          @hidePagination={{false}}
        >
          <:header as |header|>
            <header.Sortable
              @field=':no-case:name'
              @label={{t 'ar-importer.overview.table.headers.name'}}
            />
            <header.Sortable
              @field='date'
              @label={{t 'ar-importer.overview.table.headers.date'}}
            />
            <th />
          </:header>
          <:body as |arDesign|>
            <td>
              {{arDesign.name}}
            </td>
            <td>
              {{detailedDate arDesign.date}}
            </td>
            <td>
              <AuButtonGroup>
                <AuButton
                  @skin='link'
                  @icon={{VisibleIcon}}
                  {{on 'click' (fn @onShowPreview arDesign)}}
                >{{t 'ar-importer.overview.table.actions.preview'}}</AuButton>
                <AuButton
                  @skin='link'
                  @icon={{PlusIcon}}
                  {{on 'click' (fn @onInsertAr arDesign)}}
                >{{t 'ar-importer.overview.table.actions.insert'}}</AuButton>
              </AuButtonGroup>
            </td>
          </:body>
        </ReactiveTable>
      </div>
    </div>
  </template>
}
