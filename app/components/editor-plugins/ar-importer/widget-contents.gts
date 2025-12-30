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
import {
  DRAFT_STATUS_ID,
  PUBLISHED_STATUS_ID,
  SCHEDULED_STATUS_ID,
} from 'frontend-gelinkt-notuleren/utils/constants';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type { Collection } from '@ember-data/store/-private/record-arrays/identifier-array';
import type { GenerateImportResult } from 'frontend-gelinkt-notuleren/services/ar-importer';

const FILTER_TIMEOUT_MS = 300;

export type ArDesignOverviewSortField = 'name' | '-name' | 'date' | '-date';

export type DesignInfo = {
  designs: Collection<ArDesign>;
  inDocs: Record<string, Promise<EditorDocumentModel[]>>;
};

type Sig = {
  Args: {
    controller: SayController;
    onInsert?: () => void;
  };
};

export default class ArWidgetContents extends Component<Sig> {
  @service declare arImporter: ArImporterService;

  @tracked selectedDesign?: ArDesign | null;
  @tracked insertingDesign?: ArDesign | null;
  @tracked insertWarnings?: GenerateImportResult | null;

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
      return {
        designs,
        inDocs: Object.fromEntries(
          designs.map((design) => [
            design.id ?? '',
            this.store.query<EditorDocumentModel>('editor-document', {
              filter: {
                'includes-ar-designs': design.uri,
                'document-container': {
                  'current-version': { 'includes-ar-designs': design.uri },
                  status: {
                    id: `${DRAFT_STATUS_ID},${SCHEDULED_STATUS_ID},${PUBLISHED_STATUS_ID}`,
                  },
                },
              },
              fields: { 'editor-documents': 'uri' },
            }),
          ]),
        ),
      };
    } catch (e) {
      console.error(e);
      throw e;
    }
  });

  arDesigns = trackedTask<DesignInfo>(this, this.arDesignsQuery, () => [
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

  doInsert = (monads: GenerateImportResult['result']) => {
    const isSuccess = this.arImporter.insertAr(this.args.controller, monads);
    if (isSuccess) {
      this.insertingDesign = null;
      this.args.onInsert?.();
    }
  };

  insertAr = task(async (design: ArDesign) => {
    this.insertingDesign = design;
    const monadsResult = await this.arImporter.generateInsertionMonads(
      this.args.controller,
      design,
    );
    if (monadsResult.warnings.length === 0) {
      this.doInsert(monadsResult.result);
    } else {
      this.insertWarnings = monadsResult;
      this.selectedDesign = design;
      this.insertingDesign = null;
    }
  });

  confirmInsert = () => {
    if (this.insertWarnings) {
      this.doInsert(this.insertWarnings.result);
      this.insertWarnings = null;
    }
  };
  abortInsert = () => {
    this.insertWarnings = null;
    this.insertingDesign = null;
  };

  <template>
    {{#if this.insertWarnings}}
      <ArPreview
        {{! @glint-expect-error ember-truth-helpers doesnt help so might as well just ignore }}
        @arDesign={{this.selectedDesign}}
        @onReturnToOverview={{this.abortInsert}}
        @onInsertAr={{this.confirmInsert}}
        @insertLoading={{this.insertAr.isRunning}}
      />
    {{else if this.selectedDesign}}
      <ArPreview
        @arDesign={{this.selectedDesign}}
        @onReturnToOverview={{this.returnToOverview}}
        @onInsertAr={{this.insertAr.perform}}
        @insertLoading={{this.insertAr.isRunning}}
      />
    {{else}}
      <ArDesignOverview
        @arDesigns={{this.arDesigns.value}}
        @loading={{this.arDesigns.isRunning}}
        @onShowPreview={{this.selectDesign}}
        @onInsertAr={{this.insertAr.perform}}
        @insertingDesign={{this.insertingDesign}}
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
