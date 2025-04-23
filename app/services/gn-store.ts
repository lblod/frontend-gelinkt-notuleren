import Store from 'ember-data/store';
import ArrayProxy from '@ember/array/proxy';
import type {
  LegacyResourceQuery,
  QueryOptions,
} from '@ember-data/store/types';

export default class extends Store {
  async count(
    modelName: string,
    query: LegacyResourceQuery,
    options?: QueryOptions,
  ) {
    query = {
      ...query,
      page: {
        size: 1,
      },
    };
    const results = await this.query(modelName, query, options);
    return results.meta?.['count'] as number | null | undefined;
  }

  async countAndFetchAll(
    modelName: string,
    query: LegacyResourceQuery,
    options?: QueryOptions,
    batchSize = 100,
  ) {
    if ('page' in query || 'page[size]' in query || 'page[number]' in query) {
      console.error(
        'Passed `page` to `countAndFetchAll` of query, but this will overwrite these parameters.',
      );
    }
    const count = (await this.count(modelName, query, options)) ?? 0;
    const nbOfBatches = Math.ceil(count / batchSize);
    const batches = [];
    for (let i = 0; i < nbOfBatches; i++) {
      const queryForBatch = {
        ...query,
        page: {
          size: batchSize,
          number: i,
        },
      };
      const batch = this.query(modelName, queryForBatch, options);
      batches.push(batch);
    }
    query = {
      ...query,
      page: {
        size: count,
      },
    };
    const results = await Promise.all(batches);
    return ArrayProxy.create({
      content: results.map((result) => result.slice()).flat(),
      meta: {
        count,
      },
    });
  }
}
