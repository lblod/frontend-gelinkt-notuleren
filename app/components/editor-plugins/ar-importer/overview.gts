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
import { trackedFunction } from 'reactiveweb/function';
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
import type { Task } from 'ember-concurrency';

export type ArDesignOverviewSortField = 'name' | '-name' | 'date' | '-date';
export type ArDesignOverviewSignature = {
  Element: AuMainContainerSignature['Element'];
  Args: {
    onShowPreview: (arDesign: ArDesign) => void;
    onInsertAr: Task<void, [ArDesign]>;
  };
};

export default class ArDesignOverview extends Component<ArDesignOverviewSignature> {
  @service declare store: Store;

  @tracked pageNumber: number = 0;
  pageSize: number = 20;
  @tracked sort?: ArDesignOverviewSortField;

  arDesigns = trackedFunction(this, async () => {
    const { pageNumber, pageSize, sort } = this;
    await Promise.resolve();
    return this.store.query<ArDesign>('ar-design', {
      page: {
        size: pageSize,
        number: pageNumber,
      },
      sort,
    });
  });

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

  showPreview = (arDesign: ArDesign) => {
    this.args.onShowPreview(arDesign);
  };
  insertAR = async (arDesign: ArDesign) => {
    await this.args.onInsertAr.perform(arDesign);
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
              <AuInput id={{id}} @width='block' />
            {{/let}}
          </AuFormRow>
          <AuFormRow>
            {{#let (uuidv4) as |id|}}
              <AuLabel class='ar-importer-overview__form__label' for={{id}}>
                {{t 'ar-importer.overview.filters.signal-code.label'}}
              </AuLabel>
              <AuInput id={{id}} @width='block' />
            {{/let}}
          </AuFormRow>
          <AuFormRow>
            {{#let (uuidv4) as |id|}}
              <AuLabel class='ar-importer-overview__form__label' for={{id}}>
                {{t 'ar-importer.overview.filters.address.label'}}
              </AuLabel>
              <AuInput id={{id}} @width='block' />
            {{/let}}
          </AuFormRow>
          <AuButton
            class='ar-importer-overview__reset-filters-button'
            @skin='naked'
            @size='large'
            @icon={{CrossIcon}}
          >{{t 'ar-importer.overview.filters.reset'}}</AuButton>
        </form>
      </div>
      <div class='ar-importer-overview__content'>
        <ReactiveTable
          @content={{this.arDesigns.value}}
          @isLoading={{this.arDesigns.isPending}}
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
                  {{on 'click' (fn this.showPreview arDesign)}}
                >{{t 'ar-importer.overview.table.actions.preview'}}</AuButton>
                <AuButton
                  @skin='link'
                  @icon={{PlusIcon}}
                  {{on 'click' (fn this.insertAR arDesign)}}
                >{{t 'ar-importer.overview.table.actions.insert'}}</AuButton>
              </AuButtonGroup>
            </td>
          </:body>
        </ReactiveTable>
      </div>
    </div>
  </template>
}
