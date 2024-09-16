import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { assert } from '@ember/debug';
import { action } from '@ember/object';
import { restartableTask, timeout } from 'ember-concurrency';
import { task as trackedTask } from 'ember-resources/util/ember-concurrency';
import { WorshipPluginConfig } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/worship-plugin';
import {
  fetchWorshipServices,
  SearchSort,
  WorshipService,
} from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/worship-plugin/utils/fetchWorshipServices';
import { AdministrativeUnit } from '@lblod/ember-rdfa-editor-lblod-plugins/plugins/worship-plugin';

const MockData = [
  {
    date: new Date(),
    name: 'Tour de France',
    organizer: 'Some Frech Guy',
  },
  {
    date: new Date(),
    name: 'La vuelta España',
    organizer: 'Some Spanish Guy',
  },
  {
    date: new Date(),
    name: "Giro d'Italia",
    organizer: 'Some Italian Guy',
  },
];

export default class WorshipPluginSearchModalComponent extends Component {
  // Filtering
  @tracked sort = false;
  @tracked inputSearchText = null;
  // We're deliberately using the arg to set the initial value
  // eslint-disable-next-line ember/no-tracked-properties-from-args

  // Display
  @tracked error;

  // Pagination
  @tracked pageNumber = 0;
  @tracked pageSize = 20;
  @tracked totalCount = 0;

  get config() {
    return this.args.config;
  }

  get searchText() {
    return this.inputSearchText;
  }

  @action
  setInputSearchText(event) {
    assert(
      'inputSearchText must be bound to an input element',
      event.target instanceof HTMLInputElement,
    );

    this.inputSearchText = event.target.value;
  }
  @action
  async closeModal() {
    await this.servicesResource.cancel();
    this.args.closeModal();
  }

  search = restartableTask(async () => {
    await timeout(500);

    const abortController = new AbortController();

    try {
      const queryResult = await fetchCyclingRaces({
        administrativeUnitURI: this.administrativeUnit?.uri,
        config: this.args.config,
        searchMeta: {
          abortSignal: abortController.signal,
          filter: {
            label: this.inputSearchText ?? undefined,
          },
          sort: this.sort,
          page: this.pageNumber,
          pageSize: this.pageSize,
        },
      });
      this.error = undefined;

      // Reset to first page if there are no results for this one e.g. when changing search
      if (
        this.pageNumber !== 0 &&
        this.pageNumber * this.pageSize >= queryResult.totalCount
      ) {
        this.pageNumber = 0;
      }

      return queryResult;
    } catch (error) {
      this.error = error;
      return {
        results: [],
        totalCount: 0,
      };
    } finally {
      abortController.abort();
    }
  });

  servicesResource = trackedTask(this, this.search, () => [
    this.inputSearchText,
    this.administrativeUnit,
    this.pageNumber,
    this.pageSize,
    this.sort,
  ]);

  @action
  setSort(sort) {
    this.sort = sort;
  }

  @action
  previousPage() {
    --this.pageNumber;
  }

  @action
  nextPage() {
    ++this.pageNumber;
  }
}

function fetchCyclingRaces() {
  return {
    results: MockData,
    totalCount: 3,
  };
}
