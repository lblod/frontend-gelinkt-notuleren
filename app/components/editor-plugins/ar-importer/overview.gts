import type { AuMainContainerSignature } from '@appuniversum/ember-appuniversum/components/au-main-container';
import ReactiveTable from 'frontend-gelinkt-notuleren/components/common/reactive-table';
import AuButtonGroup from '@appuniversum/ember-appuniversum/components/au-button-group';
import AuButton from '@appuniversum/ember-appuniversum/components/au-button';
import { PlusIcon } from '@appuniversum/ember-appuniversum/components/icons/plus';
import { VisibleIcon } from '@appuniversum/ember-appuniversum/components/icons/visible';
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
import type { ArDesignOverviewSortField } from './widget-contents';
import type { TOC } from '@ember/component/template-only';

export type ArDesignOverviewSignature = {
  Element: AuMainContainerSignature['Element'];
  Args: {
    arDesigns?: ArDesign[] | null;
    loading?: boolean;
    onShowPreview: (arDesign: ArDesign) => void;
    onInsertAr: (arDesign: ArDesign) => void;
    nameFilter?: string;
    setNameFilter: (event: Event) => unknown;
    resetFilters: () => unknown;
    pageNumber: number;
    pageSize: number;
    updatePageNumber: (page: number) => unknown;
    sort?: ArDesignOverviewSortField;
    updateSort: (field?: ArDesignOverviewSortField) => unknown;
  };
};

const ArDesignOverview: TOC<ArDesignOverviewSignature> = <template>
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
              value={{@nameFilter}}
              {{on 'input' @setNameFilter}}
            />
          {{/let}}
        </AuFormRow>
        <AuButton
          class='ar-importer-overview__reset-filters-button'
          @skin='naked'
          @size='large'
          @icon={{CrossIcon}}
          {{on 'click' @resetFilters}}
        >{{t 'ar-importer.overview.filters.reset'}}</AuButton>
      </form>
    </div>
    <div class='ar-importer-overview__content'>
      <ReactiveTable
        @content={{@arDesigns}}
        @isLoading={{@loading}}
        @page={{@pageNumber}}
        @pageSize={{@pageSize}}
        @onPageChange={{@updatePageNumber}}
        @onSortChange={{@updateSort}}
        @sort={{@sort}}
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
</template>;

export default ArDesignOverview;
