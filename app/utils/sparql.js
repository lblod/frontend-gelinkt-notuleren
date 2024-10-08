/**
 *
 * Converts a sparql binding to a simple object contain a mapping of the binding keys to their values
 */
export function bindingToObject(binding) {
  const result = {};
  for (let key in binding) {
    result[key] = binding[key].value;
  }
  return result;
}
