import Reader from "@lblod/ember-rdfa-editor/model/readers/reader";
import ModelSelection from "@lblod/ember-rdfa-editor/model/model-selection";
import Model from "@lblod/ember-rdfa-editor/model/model";
import ModelPosition from "@lblod/ember-rdfa-editor/model/model-position";
import ModelRange from "@lblod/ember-rdfa-editor/model/model-range";

/**
 * Reader to convert a {@link Selection} to a {@link ModelSelection}
 */
export default class SelectionReader implements Reader<Selection, ModelSelection> {
  constructor(private model: Model) {
  }

  read(from: Selection): ModelSelection {
    const ranges = [];

    const rslt = new ModelSelection(this.model);

    for (let i = 0; i < from.rangeCount; i++) {
      const range = from.getRangeAt(i);
      const modelRange = this.readDomRange(range);
      if(modelRange) {
        ranges.push(modelRange);
      }
    }
    rslt.ranges = ranges;
    rslt.isRightToLeft = this.isReverseSelection(from);
    return rslt;
  }

  /**
   * Convert a {@link Range} to a {@link ModelRange}.
   * Can be null when the {@link Selection} is empty.
   * @param range
   */
  readDomRange(range: Range): ModelRange | null {
    const start = this.readDomPosition(range.startContainer, range.startOffset);
    if(!start) {
      return null;
    }
    if (range.collapsed) {
      return new ModelRange(start);
    }
    const end = this.readDomPosition(range.endContainer, range.endOffset);
    return new ModelRange(start, end ?? start);
  }

  /**
   * Convert a DOM position to a {@link ModelPosition}
   * Can be null when the {@link Selection} is empty.
   * @param container
   * @param offset
   */
  readDomPosition(container: Node, offset: number): ModelPosition | null {
    const modelNode = this.model.getModelNodeFor(container);
    const root = this.model.rootModelNode;
    if (!modelNode) {
      return null;
    }
    return ModelPosition.fromParent(root, modelNode, offset);
  }

  /**
   * Check if selection is backwards (aka right-to-left)
   * Taken from the internet
   * @param selection
   * @private
   */
  private isReverseSelection(selection: Selection): boolean {
    if (!selection.anchorNode || !selection.focusNode) return false;
    const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
    let backward = false;
    // position == 0 if nodes are the same
    if (!position && selection.anchorOffset > selection.focusOffset || position === Node.DOCUMENT_POSITION_PRECEDING) {
      backward = true;
    }
    return backward;
  }
}
