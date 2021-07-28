import Component from '@glimmer/component';
import {task} from "ember-concurrency";
import {action} from '@ember/object';
import {inject as service} from '@ember/service';
import {tracked} from 'tracked-built-ins';

export default class ImportWizardIndexComponent extends Component {
  @tracked visible=false;

  @action
  toggleModal(){
    this.visible=!this.visible;
  }
}
