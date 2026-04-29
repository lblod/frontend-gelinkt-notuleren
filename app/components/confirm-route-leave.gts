import Component from '@glimmer/component';
import { service } from '@ember/service';
import isLoadingRoute from '../utils/is-loading-route';
import type RouterService from '@ember/routing/router-service';
import type Owner from '@ember/owner';
import type PublicTransition from '@ember/routing/transition';

type Sig = {
  Args: {
    message: string;
    enabled?: boolean;
    onConfirm?: (transition?: PublicTransition) => void;
    onCancel?: (transition?: PublicTransition) => void;
  };
};

export default class ConfirmRouteLeaveComponent extends Component<Sig> {
  @service declare router: RouterService;

  constructor(owner: Owner, args: Sig['Args']) {
    super(owner, args);
    this.addExitHandler();
  }

  addExitHandler() {
    // @ts-expect-error The third argument seems not to exist in the types
    this.router.on('routeWillChange', this, this.confirm);
    window.addEventListener('beforeunload', this.confirmUnload);
  }

  removeExitHandler() {
    this.router.off('routeWillChange', this, this.confirm);
    window.removeEventListener('beforeunload', this.confirmUnload);
  }

  onConfirm(transition?: PublicTransition) {
    if (this.args.onConfirm) {
      this.args.onConfirm(transition);
    }
  }

  onCancel(transition: PublicTransition) {
    if (this.args.onCancel) {
      this.args.onCancel(transition);
    } else {
      transition.abort();

      if (window.history) {
        window.history.forward();
      }
    }
  }

  confirm = (transition: PublicTransition) => {
    if (transition.isAborted || isLoadingRoute(transition.to)) {
      return;
    }
    if (this.args.enabled) {
      if (window.confirm(this.args.message)) {
        this.onConfirm(transition);
      } else {
        this.onCancel(transition);
      }
    }
  };
  confirmUnload = (event: Event) => {
    if (!this.args.enabled) {
      return;
    }
    if (window.confirm()) {
      this.onConfirm();
    } else {
      event.preventDefault();
      if (this.args.onCancel) {
        this.args.onCancel?.();
      }
    }
  };

  willDestroy() {
    this.removeExitHandler();
    super.willDestroy();
  }
}
