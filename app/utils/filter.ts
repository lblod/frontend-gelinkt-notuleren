export async function filterAsync<T>(
  array: T[],
  callbackfn: (
    value: T,
    index: number,
    array: T[],
  ) => boolean | Promise<boolean>,
) {
  const mapped = await Promise.all(array.map(callbackfn));
  return array.filter((_value, index) => mapped[index]);
}
