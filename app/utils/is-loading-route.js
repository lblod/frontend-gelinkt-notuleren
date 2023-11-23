export default function isLoadingRoute(routeInfo) {
  const regex = new RegExp('^(.+(-|_)loading|loading)$');
  return regex.test(routeInfo.localName);
}
