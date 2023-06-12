import Component from '@glimmer/component';
import { trackedFunction } from 'ember-resources/util/function';
import { inject as service } from '@ember/service';
/** @typedef {import("../../models/signed-resource").default} SignedResource */

/**
 * @typedef {Object} Args
 * @property {string} title
 * @property {SignedResource[]} signedResources
 * @property {boolean} isPublished
 * @property {(signature: SignedResource) => Promise<void>} deleteSignature
 * @property {() => Promise<void> | void} sign
 * @property {boolean} loading
 */

/** @extends {Component<Args>}
 * @property {Args} args
 */
export default class SignatureControlsComponent extends Component {
  @service currentSession;
  @service intl;

  signatureData = trackedFunction(this, async () => {
    const signatures = this.args.signedResources;
    const first = signatures[0];
    const second = signatures[1];
    const result = { first: null, second: null, count: 0 };
    if (first) {
      const user = await first.gebruiker;
      result.first = {
        model: first,
        user,
      };
      result.count = 1;
    }
    if (second) {
      const user = await second.gebruiker;
      result.second = {
        model: second,
        user,
      };
      result.count = 2;
    }
    return result;
  });

  get signatures() {
    return this.signatureData.value ?? { first: null, second: null, count: 0 };
  }

  get firstSignature() {
    return this.signatures.first;
  }

  get secondSignature() {
    return this.signatures.second;
  }

  /**
   * @returns {boolean}
   */
  get canSignFirstSignature() {
    return (
      !this.args.loading &&
      this.currentSession.canSign &&
      this.signatures.count === 0
    );
  }

  /**
   * @returns {boolean}
   */
  get canSignSecondSignature() {
    return (
      !this.args.loading &&
      this.currentSession.canSign &&
      this.currentSession.user.id !== this.firstSignature?.user?.id &&
      this.signatures.count === 1
    );
  }

  get status() {
    if (this.signatures.count === 1) {
      return {
        signingLabel: this.intl.t('publish.need-second-signature'),
        signingColor: 'warning',
      };
    }
    if (this.signatures.count > 1) {
      return {
        signingLabel: this.intl.t('publish.signed-version'),
        signingColor: 'success',
      };
    }
    return {
      signingLabel: this.intl.t('publish.unsigned'),
      signingColor: 'border',
    };
  }
}
