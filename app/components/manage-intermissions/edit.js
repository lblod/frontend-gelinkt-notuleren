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
    if(this.args.intermissionToEdit && (this.startedAt === '' || !this.startedAt) ) {
      return this.args.intermissionToEdit.startedAt;
    } else {
      return this.startedAt;
    }
  }

  get endedAtExternal() {
    if(this.args.intermissionToEdit && (this.endedAt === '' || !this.endedAt)) {
      return this.args.intermissionToEdit.endedAt;
    } else {
      return this.endedAt;
    }
  }

  get commentExternal() {
    if(this.args.intermissionToEdit && (this.comment === '' || !this.comment)) {
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
    if(this.args.intermissionToEdit) {
      if(this.startedAt) {
        this.args.intermissionToEdit.startedAt = this.startedAt;
      }
      if(this.endedAt) {
        this.args.intermissionToEdit.endedAt = this.endedAt;
      }
      if(this.comment) {
        this.args.intermissionToEdit.comment = this.comment;
      }
      yield this.args.intermissionToEdit.save();
      yield this.args.zitting.save();
    } else {
      const intermission = this.store.createRecord("intermission", {
        startedAt: this.startedAt,
        endedAt: this.endedAt,
        comment: this.comment
      });
      this.args.zitting.intermissions.pushObject(intermission);
      yield intermission.save();
      yield this.args.zitting.save();
    }
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