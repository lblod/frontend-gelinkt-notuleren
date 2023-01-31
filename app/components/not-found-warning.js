import Component from '@glimmer/component';

export default class NotFoundWarningComponent extends Component {
  get icon() {
    return this.args.icon ?? 'link-broken';
  }

  get skin() {
    return this.args.skin ?? 'warning';
  }
}
