import Controller from '@ember/controller';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { task } from 'ember-concurrency';
import { createInstallatievergadering } from '../../../api/installatievergadering';

export default class InboxMeetingsNewInaugurationController extends Controller {
  @service router;
  @service store;
  @service intl;
  @service templateFetcher;

  @tracked location = '';
  @tracked plannedStart = new Date();

  setup() {
    this.location = '';
    this.plannedStart = new Date();
  }
  get title() {
    return this.intl.t('inbox.meetings.new.inauguration-meeting.title');
  }

  handleUpdateLocation = (event) => {
    this.location = event.target.value;
  };
  handleUpdatePlannedStart = (newValue) => {
    this.plannedStart = newValue;
  };
  createMeetingTask = task(async (event) => {
    event.preventDefault();
    const meeting = await createInstallatievergadering(this.store, {
      bestuursorgaan: this.model.bestuursorgaan,
      templateFetcher: this.templateFetcher,
      location: this.location,
      plannedStart: this.plannedStart,
    });
    this.router.replaceWith('meetings.edit', meeting.id);
  });
  cancelMeetingCreation = () => {
    // Ember has a bug where using the router service here, reruns the parent's model hooks.
    // More info: https://github.com/emberjs/ember.js/issues/19497
    // TODO use the router service once the bug is fixed:
    //this.router.replaceWith('inbox.meetings');
    // still relevant as of 15/10/2024
    this.replaceRoute('inbox.meetings');
  };
}
