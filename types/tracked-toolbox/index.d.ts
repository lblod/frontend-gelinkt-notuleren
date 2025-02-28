declare module 'tracked-toolbox' {
  export function localCopy<T>(
    memo: string,
    initializer?: T | (() => T),
  ): PropertyDecorator;
  type MemoFunc<C, T> = (component: C, key: string, last: T) => unknown;
  export function trackedReset(memo: string): PropertyDecorator;
  export function trackedReset<C, T>(args: {
    memo: string | MemoFunc<C, T>;
    update: (component: C, key: string, last: T) => T;
  }): PropertyDecorator;
}
