import { type Type } from '@warp-drive/core-types/symbols';

export default class ObjectArrayTransform<A extends object = object> {
  declare [Type]: 'object-array';

  deserialize(serialized: string): A[] {
    const parsed: unknown = JSON.parse(serialized);
    if (Array.isArray(parsed)) {
      return parsed as A[];
    } else {
      return [];
    }
  }

  serialize(deserialized: A[]): string {
    return JSON.stringify(deserialized);
  }

  static create() {
    return new this();
  }
}
