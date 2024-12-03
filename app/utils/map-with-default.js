/**
 * @template K, V
 * @extends {Map<K, V>}
 */
export class MapWithDefault extends Map {
  defaultValue;

  /**
   * @param {V} defaultValue
   * @param {readonly (readonly [K, V])[] | null} [entries]
   */
  constructor(defaultValue, entries) {
    super(entries);
    this.defaultValue = defaultValue;
  }

  /**
   * @returns {V}
   */
  get(key) {
    if (!this.has(key)) {
      return this.defaultValue;
    }
    return super.get(key);
  }

  /**
   * Method which maps each of the keys given to the passed value
   * @param {K[]} keys
   * @param {V} value
   */
  batchSet(keys, value) {
    for (const key of keys) {
      // eslint-disable-next-line ember/classic-decorator-no-classic-methods
      this.set(key, value);
    }
  }
}
