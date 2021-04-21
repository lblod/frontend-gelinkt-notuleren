import Component from '@glimmer/component';
import { task } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";
import { action } from "@ember/object";
import { inject as service } from '@ember/service';

export default class manageIntermissionsEditComponent extends Component {
  @tracked startedAt;
  @tracked endedAt;
  @tracked comment;
  @service store;


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

  @action
  cancel() {
    this.args.onClose();
  }

  @action
  changeProperty(targetProperty, event) {
    this[targetProperty] = event.target.value;
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
    this.args.onClose();
  }

  @task
  *deleteTask(intermission) {
    this.args.zitting.intermissions.removeObject(intermission);
    yield this.args.zitting.save();
    yield intermission.destroyRecord();
    this.args.onClose();
  }
}