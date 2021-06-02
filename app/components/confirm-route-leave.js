import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class ConfirmRouteLeaveComponent extends Component {
  @service router;

  constructor(...args) {
    super(...args);
    this.addExitHandler();
  }

  addExitHandler() {
    this.router.on('routeWillChange', this, this.confirm);
  }

  removeExitHandler() {
    this.router.off('routeWillChange', this, this.confirm);
  }

  onConfirm(transition) {
    if (this.args.onConfirm) {
      this.args.onConfirm(transition);
    }
  }

  onCancel(transition) {
    if (this.args.onCancel) {
      this.args.onCancel(transition);
    } else {
      transition.abort();
    }
  }

  confirm(transition) {
    if (transition.isAborted) {
      return;
    }
    if (this.args.enabled) {
      if (window.confirm(this.args.message)) {
        this.onConfirm(transition);
      } else {
        this.onCancel(transition);
      }
    }
  }

  willDestroy(...args) {
    this.removeExitHandler();
    super.willDestroy(...args);
  }
}
