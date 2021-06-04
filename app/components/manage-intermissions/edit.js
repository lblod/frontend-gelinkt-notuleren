import Component from '@glimmer/component';
import { task } from "ember-concurrency";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class manageIntermissionsEditComponent extends Component {
  @tracked startedAt;
  @tracked endedAt;
  @tracked comment;
  @service store;
  @service intl;

  constructor(...args){
    super(...args);
  }

  get startedAtExternal() {
    if(this.startedAt === '' || !this.startedAt) {
      return this.args.intermissionToEdit.startedAt;
    } else {
      return this.startedAt;
    }
  }

  get endedAtExternal() {
    if(this.endedAt === '' || !this.endedAt) {
      return this.args.intermissionToEdit.endedAt;
    } else {
      return this.endedAt;
    }
  }

  get commentExternal() {
    if(this.comment === '' || !this.comment) {
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
  *saveIntermission(){
    const intermission = this.args.intermissionToEdit;
    if(this.startedAt) {
      intermission.startedAt = this.startedAt;
    }
    if(this.endedAt) {
      intermission.endedAt = this.endedAt;
    }
    if(this.comment) {
      intermission.comment = this.comment;
    }
    if(intermission.isNew) {
      this.args.zitting.intermissions.pushObject(intermission);
    }
    yield intermission.save();
    yield this.args.zitting.save();
    this.startedAt = '';
    this.endedAt = '';
    this.comment = '';
    this.locationToBeSet = null;
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
  @tracked locationOptions = [
    { code: 'during', name: this.intl.t('manageIntermissions.duringAp') },
    { code: 'before', name: this.intl.t('manageIntermissions.beforeAp') },
    { code: 'after', name: this.intl.t('manageIntermissions.afterAp') }
  ];

  @tracked locationToBeSet;

  get selectedLocation() {
    if (this.locationToBeSet) {
      return this.locationToBeSet;
    } else {
      return this.locationOptions.find(e => e.code === this.args.intermissionToEdit.position);
    }
  }
  set selectedLocation(value) {
    this.locationToBeSet = value;
    if (this.selectedAp.content) {
      this.args.intermissionToEdit.position = this.selectedLocation.code;
    }
    if (!value) {
      this.locationToBeSet = null;
      this.args.intermissionToEdit.position = null;
      this.selectedAp = null;
    }
  }

  get selectedAp() {
    return this.args.intermissionToEdit.onderwerp;
  }
  set selectedAp(value) {
    this.args.intermissionToEdit.position = this.selectedLocation.code;
    this.args.intermissionToEdit.onderwerp = value;
  }

  @action selectAp(value) {
    this.selectedAp = value;
  }

  @action selectLocation(value) {
    this.selectedLocation = value;
  }

}
