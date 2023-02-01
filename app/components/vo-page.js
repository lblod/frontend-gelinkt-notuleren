import Component from '@glimmer/component';

export default class VoPageComponent extends Component {
  get showBanner() {
    if (this.args.showBanner === null || this.args.showBanner === undefined) {
      return true;
    } else {
      return this.args.showBanner;
    }
  }
}
