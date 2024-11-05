/**
 * Function which returns the last part of a URI (after the '/' or '#')
 * @param {string} uri
 */
export function getIdentifier(uri){
  const segments = uri.split('/');
  const lastSegment = segments.pop();
  const identifier = lastSegment.split('#').pop();
  return identifier;
}
