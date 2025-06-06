import '@ember-data/model';
import type { NoNull } from '@ember-data/model/-private/belongs-to';
import type { RelationshipDecorator } from '@ember-data/model/-private/belongs-to';
import type { RelationshipOptions } from '@ember-data/model/-private/belongs-to';
import type { TypeFromInstance } from '@warp-drive/core-types/record';

type HasManyOptions = RelationshipOptions<T, boolean> & {
  defaultPageSize?: number;
};

declare module '@ember-data/model' {
  export function hasMany<T>(
    type: TypeFromInstance<NoNull<T>>,
    options: HasManyOptions,
  ): RelationshipDecorator<T>;
  export function hasMany(
    type: string,
    options: HasManyOptions,
  ): RelationshipDecorator<unknown>;
}
