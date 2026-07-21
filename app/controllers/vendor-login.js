import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { timeout, task, restartableTask } from 'ember-concurrency';
import { service } from '@ember/service';

export default class MockLoginController extends Controller {
  @service store;
  @service session;
  @tracked organization;
  @tracked username;
  @tracked key;

  updateOrganization = (event) => {
    if (event.target && 'value' in event.target) {
      this.organization = event.target.value;
    }
  };

  updateUsername = (event) => {
    if (event.target && 'value' in event.target) {
      this.username = event.target.value;
    }
  };

  updateKey = (event) => {
    if (event.target && 'value' in event.target) {
      this.key = event.target.value;
    }
  };

  login = task(async () => {
    console.log('logging');

    try {
      await this.session.authenticate(
        'authenticator:vendor-login',
        this.organization,
        this.username,
        this.key,
      );
    } catch (response) {
      if (response instanceof Response)
        this.errorMessage = `Something went wrong, please try again later (status: ${response.status} ${response.statusText})`;
      else if (response instanceof Error) this.errorMessage = response?.message;
    }
  });
}
