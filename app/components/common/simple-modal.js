/**
  * Based on https://github.com/appuniversum/ember-appuniversum/blob/3e2765ce76f4346876638f47e181aa69f193c401/addon/components/au-modal.gts

  * The MIT License (MIT)
  * Copyright (c) 2020
  * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
  * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

import Component from '@glimmer/component';
import { action } from '@ember/object';

const FOCUS_TRAP_ADDITIONAL_ELEMENTS = ['#ember-basic-dropdown-wormhole'];
export default class SimpleModal extends Component {
  destinationElement;

  constructor(owner, args) {
    super(owner, args);

    this.destinationElement = document.querySelector(
      '[data-au-modal-container]',
    );
  }

  get size() {
    if (this.args.size === 'fullscreen') return 'au-c-modal--fullscreen';
    if (this.args.size === 'large') return 'au-c-modal--large';
    else return '';
  }

  get padding() {
    if (this.args.padding === 'none') return 'au-c-modal--flush';
    else return '';
  }

  get overflow() {
    if (this.args.overflow) return 'au-c-modal--overflow';
    else return '';
  }

  get initialFocus() {
    return this.args.initialFocus;
  }

  get fallbackFocus() {
    return '.au-c-modal';
  }

  get additionalElements() {
    return FOCUS_TRAP_ADDITIONAL_ELEMENTS.filter(
      (element) => document.querySelector(element) !== null,
    );
  }

  @action
  handleCloseClick() {
    if (this.isClosable) {
      this.closeModal();
    }
  }

  @action
  handleEscapePress() {
    if (this.isClosable) {
      this.closeModal();
    }

    // escapeDeactivates should be set to false since we don't want the focus-trap to deactivate if the modal stays open
    // which could happen if the consumer doesn't change the `@modalOpen` argument in the callback.
    return false;
  }

  @action
  closeModal() {
    this.args.closeModal?.();
  }
}
