import Component from "@ember/component";
import { action } from "@ember/object";
import { tracked } from "@glimmer/tracking";

export default class popover extends Component {
  // Track Popover state
  @tracked popoverOpen = false;

  // Open Popover
  @action
  togglePopover() {
    // Toggle Popover view state
    this.popoverOpen = !this.popoverOpen;
  }

  @action
  closePopover() {
    // Close Popover view state
    this.popoverOpen = false;
  }

  @action
  escapePopover(event) {
    // Close Popover view state on escape keydown
    if (event.keyCode === 27) {
      this.popoverOpen = false;
    }
  }

  @action
  popoverFocus(element) {
    let menuItems = element.querySelectorAll('button');

    // Focus first button
    menuItems[0].focus();
  }
}
