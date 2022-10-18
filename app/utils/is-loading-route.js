export default function isLoadingRoute(routeInfo) {
  const regex = new RegExp('^(.+-loading|loading)$');
  return regex.test(routeInfo.localName);
}
