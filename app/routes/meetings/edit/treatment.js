import Route from '@ember/routing/route';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class MeetingsEditTreatmentRoute extends Route {
  @service intl;

  async model(params) {
    const treatment = await this.store.findRecord(
      'behandeling-van-agendapunt',
      params.treatment_id
    );
    return {
      treatment,
      meetingId: this.paramsFor('meetings.edit').id,
    };
  }

  @action
  willTransition(transition) {
    //

    // the ember official docs contain an example where the controller is accessed in the route
    // also see https://github.com/ember-cli/eslint-plugin-ember/issues/1108
    // eslint-disable-next-line ember/no-controller-access-in-routes
    const controller = this.controllerFor('meetings.edit.treatment');
    const dirty = controller.dirty;
    if (dirty && !confirm(this.intl.t('behandelingVanAgendapunten.confirmLeaveWithoutSaving'))) {
      transition.abort();
    } else {
      controller.documentContainer.rollbackAttributes;
      return true;
    }
  }

  setupController(controller, model) {
    super.setupController(controller, model);
    controller.editor = null;
    controller.fetchOrCreateDocumentTask.perform();
    controller.confirmLeaveOpen = false;
  }
}
