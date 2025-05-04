import type Route from '@ember/routing/route';

export type LangString = {
  content: string;
  language: string;
  toString: () => string;
};

export type ModelFrom<R extends Route> = Awaited<ReturnType<R['model']>>;
