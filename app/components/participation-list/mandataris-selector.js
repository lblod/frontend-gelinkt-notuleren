import Component from '@glimmer/component';
import { action } from "@ember/object";
import { timeout } from 'ember-concurrency';
import {task} from 'ember-concurrency-decorators'

export default class ParticipationListMandatarisSelectorComponent extends Component {
  @action
  select() {

  }
  @task
  *searchByName(){

  }
}
