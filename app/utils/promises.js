/**
 *
 * A more generic version of `Promise.all`.
 *
 * Works with all kind of objects (and lists).
 * Has an optional `recursive` flag
 * @param {Record<string | number, unknown>} obj
 * @param {boolean} recursive
 */
export async function promiseProperties(obj, recursive = false) {
  const inputIsList = Array.isArray(obj);
  const entries = Object.entries(obj);
  const awaitedEntries = await Promise.all(
    entries.map(async ([k, v]) => {
      let awaited = await v;
      if (recursive && typeof awaited === 'object' && awaited !== null) {
        awaited = await promiseProperties(awaited, true);
      }
      return [k, awaited];
    }),
  );
  const awaitedObject = Object.fromEntries(awaitedEntries);
  return inputIsList ? Object.values(awaitedObject) : awaitedObject;
}
