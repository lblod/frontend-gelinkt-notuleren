import { action } from '@ember/object';
import Component from '@glimmer/component';
import {
  redo,
  redoDepth,
  undoDepth,
} from '@lblod/ember-rdfa-editor/plugins/history';
import SayController from '@lblod/ember-rdfa-editor/core/say-controller';

type Args = {
  controller?: SayController;
};
export default class RedoComponent extends Component<Args> {
  get disabled() {
    if (!this.args.controller) {
      return true;
    }
    const editorState = this.args.controller.getState(true);
    const undosAvailable = redoDepth(editorState) as number;
    return undosAvailable === 0;
  }

  @action
  onClick() {
    if (this.args.controller) {
      this.args.controller.focus();
      this.args.controller.doCommand(redo);
    }
  }
}
