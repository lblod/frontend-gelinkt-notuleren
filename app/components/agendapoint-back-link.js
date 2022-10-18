import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { trackedFunction } from 'ember-resources/util/function';

export default class ZittingLinkComponent extends Component {
  @service store;
  meetingData = trackedFunction(this, async () => {
    const meetingId = this.args.meetingId;
    await Promise.resolve();
    const meeting = await this.store.findRecord('zitting', meetingId);
    return meeting;
  });

  get meeting() {
    return this.meetingData.value;
  }

  administrativeBodyData = trackedFunction(this, async () => {
    const meeting = this.meeting;
    await Promise.resolve();
    let bestuursorgaan = await meeting?.get('bestuursorgaan');
    bestuursorgaan = await bestuursorgaan?.get('isTijdsspecialisatieVan');
    return bestuursorgaan;
  });

  get administrativeBodyName() {
    return this.administrativeBodyData.value
      ? this.administrativeBodyData.value.naam
      : '';
  }
}
