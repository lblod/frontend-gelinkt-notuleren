import Component from '@glimmer/component';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import {
  BEFORE_POS_ID,
  DURING_POS_ID,
  AFTER_POS_ID,
} from 'frontend-gelinkt-notuleren/utils/constants';

export default class manageIntermissionsEditComponent extends Component {
  @tracked startedAt;
  @tracked endedAt;
  @tracked comment;
  @service store;
  @service intl;

  constructor(...args) {
    super(...args);
  }

  get startedAtExternal() {
    if (this.startedAt === '' || !this.startedAt) {
      return this.args.intermissionToEdit.startedAt;
    } else {
      return this.startedAt;
    }
  }

  get endedAtExternal() {
    if (this.endedAt === '' || !this.endedAt) {
      return this.args.intermissionToEdit.endedAt;
    } else {
      return this.endedAt;
    }
  }

  get commentExternal() {
    if (this.comment === '' || !this.comment) {
      return this.args.intermissionToEdit.comment;
    } else {
      return this.comment;
    }
  }

  set commentExternal(value) {
    this.comment = value;
  }

  @action
  cancel() {
    this.args.onClose();
  }

  @action
  changeDate(targetProperty, value) {
    this[targetProperty] = value;
  }

  saveIntermission = task(async () => {
    const intermission = this.args.intermissionToEdit;
    if (this.startedAt) {
      intermission.startedAt = this.startedAt;
    }
    if (this.endedAt) {
      intermission.endedAt = this.endedAt;
    }
    if (this.comment) {
      intermission.comment = this.comment;
    }
    if (intermission.isNew) {
      this.args.zitting.intermissions.pushObject(intermission);
    }
    await this.savePosition.perform();
    await intermission.save();
    await this.args.zitting.save();
    this.startedAt = '';
    this.endedAt = '';
    this.comment = '';
    this.args.onClose();
  });

  deleteTask = task(async (intermission) => {
    this.args.zitting.intermissions.removeObject(intermission);
    await this.args.zitting.save();
    await intermission.destroyRecord();
    this.args.onClose();
  });

  //position stuff
  get positionOptions() {
    return [
      {
        code: 'before',
        name: this.intl.t('manage-intermissions.before-ap'),
        conceptUuid: BEFORE_POS_ID,
      },
      {
        code: 'during',
        name: this.intl.t('manage-intermissions.during-ap'),
        conceptUuid: DURING_POS_ID,
      },
      {
        code: 'after',
        name: this.intl.t('manage-intermissions.after-ap'),
        conceptUuid: AFTER_POS_ID,
      },
    ];
  }
  @action
  updatedIntermission() {
    this.fetchPosition.perform();
  }

  savePosition = task(async () => {
    const intermission = await this.args.intermissionToEdit;
    let agendaPos = await intermission.agendaPosition;
    if (!agendaPos) {
      agendaPos = await this.store.createRecord('agenda-position');
      await agendaPos.save();
      intermission.agendaPosition = agendaPos;
    }
    agendaPos.agendapoint = this.selectedAp;
    if (this.selectedAp && this.selectedPosition) {
      agendaPos.position = await this.store.findRecord(
        'concept',
        this.selectedPosition.conceptUuid
      );
    } else {
      agendaPos.position = null;
    }
    await agendaPos.save();
  });

  fetchPosition = task(async () => {
    const intermission = await this.args.intermissionToEdit;
    const agendaPos = await intermission.agendaPosition;
    if (agendaPos) {
      const posConcept = await agendaPos.position;
      if (posConcept) {
        this.selectedPosition = this.positionOptions.find(
          (e) => e.conceptUuid === posConcept.id
        );
      } else {
        this.selectedPosition = null;
      }
      const posAp = await agendaPos.agendapoint;
      if (posAp) {
        this.selectedAp = posAp;
      } else {
        this.selectedAp = null;
      }
    } else {
      this.selectedAp = null;
      this.selectedPosition = null;
    }
  });

  @tracked selectedPosition;

  @tracked selectedAp;

  @action selectAp(value) {
    this.selectedAp = value;
  }

  @action selectPosition(value) {
    this.selectedPosition = value;
    if (!value) {
      this.selectedAp = null;
    }
  }

  searchMatcher(agendapoint, term) {
    return `${agendapoint.position + 1}. ${agendapoint.titel}`.indexOf(term);
  }
}
