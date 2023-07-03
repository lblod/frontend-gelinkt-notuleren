import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { service } from '@ember/service';
import { action } from '@ember/object';

export default class MeetingsPublishPublicationActionsController extends Controller {
  queryParams = ['type'];
  @service intl;

  types = [
    {
      value: 'agenda',
      label: this.intl.t('meetings.publish.agenda.title'),
    },
    {
      value: 'versioned-besluiten-lijst',
      label: this.intl.t('meetings.publish.decision-list.title'),
    },
    {
      value: 'versioned-behandeling',
      label: this.intl.t('meetings.publish.extracts.title'),
    },
    {
      value: 'versioned-notulen',
      label: this.intl.t('meetings.publish.document.title'),
    },
  ];

  sort = '-date';
  @tracked page = 0;
  @tracked pageSize = 20;
  @tracked type = null;

  @action
  updateType(type) {
    if (type) {
      this.type = type.value;
      this.page = 0;
    } else {
      this.type = null;
    }
  }

  get selectedType() {
    return this.types.find((type) => type.value === this.type);
  }

  actionLabel = (log) => {
    return this.intl.t(
      `meetings.publish.publication-actions.actions.${log.action}`
    );
  };
}
