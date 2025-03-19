import { type Type } from '@warp-drive/core-types/symbols';

export default class StringArrayTransform {
  declare [Type]: 'string-array';

  deserialize(serialized: string) {
    const parsed: unknown = JSON.parse(serialized);
    if (Array.isArray(parsed)) {
      return parsed as string[];
    } else {
      return [];
    }
  }

  serialize(deserialized: string[]) {
    return JSON.stringify(deserialized);
  }

  static create() {
    return new this();
  }
}
