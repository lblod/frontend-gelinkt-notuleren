import Route from '@ember/routing/route';
import type MeetingsPublishNotulenController from 'frontend-gelinkt-notuleren/controllers/meetings/publish/notulen';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import type MeetingsPublishRoute from '../publish';
import type Transition from '@ember/routing/transition';

export default class MeetingsPublishNotulenRoute extends Route {
  model() {
    return this.modelFor('meetings.publish') as ModelFrom<MeetingsPublishRoute>;
  }

  setupController(
    controller: MeetingsPublishNotulenController,
    model: ModelFrom<MeetingsPublishRoute>,
  ) {
    super.setupController(controller, model);
    controller.initialize();
  }

  resetController(
    controller: MeetingsPublishNotulenController,
    isExiting: boolean,
    transition: Transition,
  ) {
    super.resetController(controller, isExiting, transition);
    controller.resetController();
  }
}
