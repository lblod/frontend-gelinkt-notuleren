import { Editor } from '@lblod/ember-rdfa-editor/core/editor';
import State from '@lblod/ember-rdfa-editor/core/state';
import Transaction from '@lblod/ember-rdfa-editor/core/transaction';
import SelectionReader from '@lblod/ember-rdfa-editor/model/readers/selection-reader';
import { getWindowSelection } from '@lblod/ember-rdfa-editor/utils/dom-helpers';

export interface EventWithState<E extends Event> {
  event: E;
  state: State;
}

export interface InputHandler {
  afterInput(event: InputEvent): void;

  beforeInput(event: InputEvent): void;
}

export class EditorInputHandler implements InputHandler {
  private editor: Editor;

  constructor(editor: Editor) {
    this.editor = editor;
  }

  afterInput(event: InputEvent): void {}

  beforeInput(event: InputEvent): void {
    let transaction = new Transaction(this.editor.state);
        console.log(event);
    switch (event.inputType) {
      case 'insertText':
        event.preventDefault();
        const selectionReader = new SelectionReader();
        const insertRange = selectionReader.readDomRange(
          this.editor.view,
          event.getTargetRanges()[0]
        )!;
        transaction.insertText({ range: insertRange, text: event.data || "" });
        transaction.needsToWrite = true;
        break;
      case 'insertLineBreak':
        break;
      case 'deleteWordBackward':
        break;
      case 'deleteWordForward':
        break;
      default:
        break;
    }
    updateState(this.editor, transaction);
  }

  beforeSelectionChange(event: Event): void {}

  afterSelectionChange(event: Event): void {
    const currentSelection = getWindowSelection();
    const view = this.editor.view;
    const viewRoot = this.editor.view.domRoot;
    if (
      !viewRoot.contains(currentSelection.anchorNode) ||
      !viewRoot.contains(currentSelection.focusNode) ||
      (currentSelection.type != 'Caret' &&
        viewRoot === currentSelection.anchorNode &&
        currentSelection.anchorOffset === currentSelection.focusOffset)
    ) {
      return;
    }
    const selectionReader = new SelectionReader();
    const newSelection = selectionReader.read(
      this.editor.view,
      currentSelection
    );
    const tr = new Transaction(this.editor.state);
    tr.setSelection(newSelection);
    updateState(this.editor, tr);
  }
}

function updateState(editor: Editor, transaction: Transaction) {
  const finalTransaction = runTransactionByPlugins(transaction);
  const newState = finalTransaction.apply();
  editor.state = newState;
  console.log(finalTransaction);
  if (finalTransaction.needsToWrite) {
    editor.view.update(newState);
  }
}

function runTransactionByPlugins(transaction: Transaction): Transaction {
  // TODO
  return transaction;
}
