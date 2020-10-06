import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class BehandelingVanAgendapuntComponent extends Component {
  @tracked title;
  @tracked openbaar;
}
