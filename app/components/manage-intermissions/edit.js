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

  @task
  *saveIntermission() {
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
    yield this.savePosition.perform();
    yield intermission.save();
    yield this.args.zitting.save();
    this.startedAt = '';
    this.endedAt = '';
    this.comment = '';
    this.args.onClose();
  }

  @task
  *deleteTask(intermission) {
    this.args.zitting.intermissions.removeObject(intermission);
    yield this.args.zitting.save();
    yield intermission.destroyRecord();
    this.args.onClose();
  }

  //position stuff
  get positionOptions() {
    return [
      {
        code: 'before',
        name: this.intl.t('manageIntermissions.beforeAp'),
        conceptUuid: BEFORE_POS_ID,
      },
      {
        code: 'during',
        name: this.intl.t('manageIntermissions.duringAp'),
        conceptUuid: DURING_POS_ID,
      },
      {
        code: 'after',
        name: this.intl.t('manageIntermissions.afterAp'),
        conceptUuid: AFTER_POS_ID,
      },
    ];
  }
  @action
  updatedIntermission() {
    this.fetchPosition.perform();
  }

  @task
  *savePosition() {
    const intermission = yield this.args.intermissionToEdit;
    let agendaPos = yield intermission.agendaPosition;
    if (!agendaPos) {
      agendaPos = yield this.store.createRecord('agenda-position');
      yield agendaPos.save();
      intermission.agendaPosition = agendaPos;
    }
    agendaPos.agendapoint = this.selectedAp;
    if (this.selectedAp && this.selectedPosition) {
      agendaPos.position = yield this.store.findRecord(
        'concept',
        this.selectedPosition.conceptUuid
      );
    } else {
      agendaPos.position = null;
    }
    yield agendaPos.save();
  }

  @task
  *fetchPosition() {
    const intermission = yield this.args.intermissionToEdit;
    const agendaPos = yield intermission.agendaPosition;
    if (agendaPos) {
      const posConcept = yield agendaPos.position;
      if (posConcept) {
        this.selectedPosition = this.positionOptions.find(
          (e) => e.conceptUuid === posConcept.id
        );
      } else {
        this.selectedPosition = null;
      }
      const posAp = yield agendaPos.agendapoint;
      if (posAp) {
        this.selectedAp = posAp;
      } else {
        this.selectedAp = null;
      }
    } else {
      this.selectedAp = null;
      this.selectedPosition = null;
    }
  }

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
