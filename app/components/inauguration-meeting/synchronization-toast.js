import Component from '@glimmer/component';
import ENV from 'frontend-gelinkt-notuleren/config/environment';

export default class InaugurationMeetingSynchronizationToast extends Component {
  get lmbEndpoint(){
    return ENV.lmbEndpoint;
  }
}
