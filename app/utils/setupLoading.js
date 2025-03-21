export default function setupLoading(transition, controller, routeName) {
  controller.set('isLoadingModel', true);
  transition.promise?.finally(function () {
    controller.set('isLoadingModel', false);
  });
  return !transition.from?.name.includes(routeName); // bubble the loading event only if we are not refreshing the model
}
