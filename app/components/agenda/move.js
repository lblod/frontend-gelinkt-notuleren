import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class AgendaMoveComponent extends Component {

  constructor(...args){
    super(...args);
  }

  @tracked locationOptions = [
    { code: 'start', name: 'Vooraan in agenda' },
    { code: 'after', name: 'Na agendapunt' },
    { code: 'end', name: 'Achteraan in agenda' }
  ];
}
