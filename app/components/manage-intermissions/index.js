import Component from '@glimmer/component';
import { task } from "ember-concurrency";
import { tracked } from "@glimmer/tracking";
import {action} from '@ember/object';
import { inject as service } from '@ember/service';

export default class manageIntermissionsComponent extends Component {
  @tracked intermissions = [];
  @tracked intermissionToEdit;
  @tracked showModal = false;
  @service store;

  constructor() {
    super(...arguments);
    this.fetchIntermissions.perform();
  }

  @action
  addIntermission() {
    this.intermissionToEdit = this.store.createRecord("intermission", {
      startedAt: this.args.zitting.geplandeStart
    });
    this.showModal = true;
  }

  @action
  editIntermission(intermission) {
    this.intermissionToEdit = intermission;
    this.showModal = true;
  }

  @task
  *fetchIntermissions(){
    this.intermissions =  yield this.args.zitting.get('intermissions');
  }

  @action
  closeEdit() {
    this.showModal = false;
  }
}
