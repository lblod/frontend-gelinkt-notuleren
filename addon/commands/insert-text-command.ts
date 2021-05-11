import Command from "@lblod/ember-rdfa-editor/commands/command";
import Model from "@lblod/ember-rdfa-editor/model/model";
import ModelRange from "@lblod/ember-rdfa-editor/model/model-range";
import {MisbehavedSelectionError} from "@lblod/ember-rdfa-editor/utils/errors";
import {NON_BREAKING_SPACE} from "@lblod/ember-rdfa-editor/model/util/constants";

export default class InsertTextCommand extends Command {
  name = "insert-text";

  constructor(model: Model) {
    super(model);
  }

  execute(text: string, range: ModelRange | null = this.model.selection.lastRange): void {
    if (!range) {
      throw new MisbehavedSelectionError();
    }
    this.model.change(mutator => {
      if (text.charAt(0) === " ") {
        const charBefore = range.start.charactersBefore(1);
        if (charBefore === " ") {
          text = NON_BREAKING_SPACE + text;
          range.start = range.start.shiftedBy(-1);
        }
      }
      const resultRange = mutator.insertText(range, text);
      const commonAncestor = resultRange.getCommonAncestor();
      resultRange.collapse();
      this.model.selectRange(resultRange);
      return commonAncestor;
    });
  }

}
