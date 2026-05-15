export async function filterAsync<T>(
  array: T[],
  callbackfn: (
    value: T,
    index: number,
    array: T[],
  ) => boolean | Promise<boolean>,
) {
  const mapped = await Promise.all(
    array.map((value: T, index: number, array: T[]) => {
      const promiseOrBool = callbackfn(value, index, array);
      if (typeof promiseOrBool === 'boolean') {
        return new Promise(() => promiseOrBool);
      } else {
        return promiseOrBool;
      }
    }),
  );
  return array.filter((_value, index) => mapped[index]);
}
