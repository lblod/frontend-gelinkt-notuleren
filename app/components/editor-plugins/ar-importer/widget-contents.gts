import Component from '@glimmer/component';
import { service } from '@ember/service';
import { tracked } from 'tracked-built-ins';
import { restartableTask, task, timeout } from 'ember-concurrency';
import type { SayController } from '@lblod/ember-rdfa-editor';
import type Store from 'frontend-gelinkt-notuleren/services/gn-store';

import ArDesign from 'frontend-gelinkt-notuleren/models/ar-design';
import type ArImporterService from 'frontend-gelinkt-notuleren/services/ar-importer';
import ArPreview from './preview';
import ArDesignOverview from './overview';
import { trackedTask } from 'reactiveweb/ember-concurrency';

const FILTER_TIMEOUT_MS = 300;

export type ArDesignOverviewSortField = 'name' | '-name' | 'date' | '-date';

type Sig = {
  Args: {
    controller: SayController;
    onInsert?: () => void;
  };
};

export default class ArWidgetContents extends Component<Sig> {
  @service declare arImporter: ArImporterService;

  @tracked selectedDesign?: ArDesign | null;

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

  selectDesign = (design: ArDesign) => {
    this.selectedDesign = design;
  };

  returnToOverview = () => {
    this.selectedDesign = null;
  };

  insertAr = task(async (design: ArDesign) => {
    const isSuccess = await this.arImporter.insertAr(
      this.args.controller,
      design,
    );
    if (isSuccess) {
      this.args.onInsert?.();
    }
  });

  <template>
    {{#if this.selectedDesign}}
      <ArPreview
        @arDesign={{this.selectedDesign}}
        @onReturnToOverview={{this.returnToOverview}}
        @onInsertAr={{this.insertAr.perform}}
      />
    {{else}}
      <ArDesignOverview
        @arDesigns={{this.arDesigns.value}}
        @loading={{this.arDesigns.isRunning}}
        @onShowPreview={{this.selectDesign}}
        @onInsertAr={{this.insertAr.perform}}
        @nameFilter={{this.nameFilter}}
        @setNameFilter={{this.setNameFilter}}
        @resetFilters={{this.resetFilters}}
        @pageNumber={{this.pageNumber}}
        @pageSize={{this.pageSize}}
        @updatePageNumber={{this.updatePageNumber}}
        @sort={{this.sort}}
        @updateSort={{this.updateSort}}
      />
    {{/if}}
  </template>
}
