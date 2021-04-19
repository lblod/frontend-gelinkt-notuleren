import Component from '@glimmer/component';
import { task } from "ember-concurrency-decorators";
import { tracked } from "@glimmer/tracking";
import {action} from '@ember/object';

export default class manageIntermissionsComponent extends Component {
  @tracked intermissions = [];
  @tracked intermissionToEdit;
  @tracked showModal = false;

  constructor(parent, args) {
    super(parent, args);
    this.fetchIntermissions.perform();
  }

  @action
  addIntermission() {
    this.intermissionToEdit = undefined;
    this.showModal = true;
  }

  @action
  editIntermission(intermission) {
    this.intermissionToEdit = intermission;
    this.showModal = true;
  }

  @task
  *deleteIntermission(intermission) {
    this.args.zitting.intermissions.removeObject(intermission);
    yield this.args.zitting.save();
    yield intermission.destroyRecord();
  }

  @task
  *fetchIntermissions(){
    this.intermissions =  yield this.args.zitting.get('intermissions');
    console.log(this.args.zitting);
    console.log(this.args.zitting.get('intermissions'));
  }

  @action
  closeEdit() {
    this.showModal = false;
  }
}