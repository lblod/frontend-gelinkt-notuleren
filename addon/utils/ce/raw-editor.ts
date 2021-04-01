import EmberObject from '@ember/object';
import Command from "@lblod/ember-rdfa-editor/commands/command";
import IndentListCommand from "@lblod/ember-rdfa-editor/commands/indent-list-command";
import InsertHtmlCommand from '@lblod/ember-rdfa-editor/commands/insert-html-command';
import InsertNewLiCommand from "@lblod/ember-rdfa-editor/commands/insert-newLi-command";
import InsertNewLineCommand from "@lblod/ember-rdfa-editor/commands/insert-newLine-command";
import InsertColumnAfterCommand from "@lblod/ember-rdfa-editor/commands/insert-table-column-after-command";
import InsertColumnBeforeCommand from "@lblod/ember-rdfa-editor/commands/insert-table-column-before-command";
import InsertTableCommand from "@lblod/ember-rdfa-editor/commands/insert-table-command";
import InsertRowAboveCommand from "@lblod/ember-rdfa-editor/commands/insert-table-row-above-command";
import InsertRowBelowCommand from "@lblod/ember-rdfa-editor/commands/insert-table-row-below-command";
import MakeListCommand from '@lblod/ember-rdfa-editor/commands/make-list-command';
import RemoveListCommand from '@lblod/ember-rdfa-editor/commands/remove-list-command';
import RemoveTableColumnCommand from "@lblod/ember-rdfa-editor/commands/remove-table-column-command";
import RemoveTableCommand from "@lblod/ember-rdfa-editor/commands/remove-table-command";
import RemoveTableRowCommand from "@lblod/ember-rdfa-editor/commands/remove-table-row-command";
import MakeBoldCommand from '@lblod/ember-rdfa-editor/commands/text-properties/make-bold-command';
import MakeHighlightCommand from '@lblod/ember-rdfa-editor/commands/text-properties/make-highlight-command';
import MakeItalicCommand from '@lblod/ember-rdfa-editor/commands/text-properties/make-italic-command';
import MakeStrikethroughCommand from "@lblod/ember-rdfa-editor/commands/text-properties/make-strikethrough-command";
import MakeUnderlineCommand from "@lblod/ember-rdfa-editor/commands/text-properties/make-underline-command";
import RemoveBoldCommand from '@lblod/ember-rdfa-editor/commands/text-properties/remove-bold-command';
import RemoveHighlightCommand from '@lblod/ember-rdfa-editor/commands/text-properties/remove-highlight-command';
import RemoveItalicCommand from '@lblod/ember-rdfa-editor/commands/text-properties/remove-italic-command';
import RemoveStrikethroughCommand from "@lblod/ember-rdfa-editor/commands/text-properties/remove-strikethrough-command";
import RemoveUnderlineCommand from "@lblod/ember-rdfa-editor/commands/text-properties/remove-underline-command";
import UnindentListCommand from "@lblod/ember-rdfa-editor/commands/unindent-list-command";
import Model from "@lblod/ember-rdfa-editor/model/model";
import ModelRange from '@lblod/ember-rdfa-editor/model/model-range';
import ModelSelection from '@lblod/ember-rdfa-editor/model/model-selection';
import { walk as walkDomNode } from "@lblod/marawa/node-walker";
import RichNode from "@lblod/marawa/rich-node";
import classic from 'ember-classic-decorator';

/**
 * Raw contenteditable editor. This acts as both the internal and external API to the DOM.
 * Any editing operations should be implemented as {@link Command commands}. External plugins can register their own commands.
 * Commands have access to the {@link Model} which represents our interface to the real DOM.
 * TODO: Do we really need to extend EmberObject?
 *
 * @module contenteditable-editor
 * @class RawEditor
 * @constructor
 * @extends EmberObject
 */
@classic
class RawEditor extends EmberObject {
  registeredCommands: Map<string, Command> = new Map()
  model: Model;
  protected tryOutVdom = true;

  /**
   * a rich representation of the dom tree created with {{#crossLink "NodeWalker"}}NodeWalker{{/crossLink}}
   * @property richNode
   * @type RichNode
   * @protected
   */
  richNode!: RichNode;

  constructor(...args: any[]) {
    super(...args);
    this.model = new Model();
    // @ts-ignore
    window.__VDOM = this.model;
    // @ts-ignore
    window.__executeCommand = this.executeCommand.bind(this);
    this.registerCommand(new MakeBoldCommand(this.model));
    this.registerCommand(new RemoveBoldCommand(this.model));
    this.registerCommand(new MakeItalicCommand(this.model));
    this.registerCommand(new RemoveItalicCommand(this.model));
    this.registerCommand(new MakeStrikethroughCommand(this.model));
    this.registerCommand(new RemoveStrikethroughCommand(this.model));
    this.registerCommand(new MakeUnderlineCommand(this.model));
    this.registerCommand(new RemoveUnderlineCommand(this.model));
    this.registerCommand(new MakeListCommand(this.model));
    this.registerCommand(new RemoveListCommand(this.model));
    this.registerCommand(new UnindentListCommand(this.model));
    this.registerCommand(new IndentListCommand(this.model));
    this.registerCommand(new InsertNewLineCommand(this.model));
    this.registerCommand(new InsertNewLiCommand(this.model));
    this.registerCommand(new MakeHighlightCommand(this.model));
    this.registerCommand(new RemoveHighlightCommand(this.model));
    this.registerCommand(new InsertTableCommand(this.model));
    this.registerCommand(new InsertRowBelowCommand(this.model));
    this.registerCommand(new InsertRowAboveCommand(this.model));
    this.registerCommand(new InsertColumnAfterCommand(this.model));
    this.registerCommand(new InsertColumnBeforeCommand(this.model));
    this.registerCommand(new RemoveTableRowCommand(this.model));
    this.registerCommand(new RemoveTableColumnCommand(this.model));
    this.registerCommand(new RemoveTableCommand(this.model));
    this.registerCommand(new InsertHtmlCommand(this.model));
  }

  /**
   * @method updateRichNode
   * @private
   */
  updateRichNode() {
    const richNode = walkDomNode(this.rootNode);
    this.set('richNode', richNode);
  }

  /**
   * The root node of the editor. This is the node with the contentEditable attribute.
   * No operations should ever affect any node outside of its tree.
   */
  get rootNode(): HTMLElement {
    return this.model.rootNode;
  }

  get selection(): ModelSelection {
    return this.model.selection;
  }

  set rootNode(rootNode: HTMLElement) {
    this.model.rootNode = rootNode;
    if (rootNode) {
      this.model.read();
      this.model.write();
      this.updateRichNode();
    }
  }


  /**
   * Register a command for use with {@link executeCommand}
   * @param command
   */
  registerCommand(command: Command) {
    this.registeredCommands.set(command.name, command);
  }

  /**
   * Execute a command with name commandName. Any extra arguments are passed through to the command.
   * @param commandName
   * @param args
   */
  executeCommand(commandName: string, ...args: any[]) {
    try {
      const command = this.getCommand(commandName);
      if (command.canExecute(...args)) {
        this.getCommand(commandName).execute(...args);
        this.updateRichNode();
      }

    } catch (e) {
      console.log(e);
    }
  }

  /**
   * Check if a command can be executed in the given context
   * It is not required to check this before executing, as a command will
   * not run when this condition is not met. But it can be useful know if a command
   * is valid without running it.
   * @param commandName
   * @param args
   */
  canExecuteCommand(commandName: string, ...args: any[]) {
    return this.getCommand(commandName).canExecute(...args);
  }

  private getCommand(commandName: string): Command {
    const command = this.registeredCommands.get(commandName);
    if (!command) {
      throw new Error(`Unrecognized command ${commandName}`);
    }
    return command;
  }

  /**
   * create a Range within the virtual dom
   * @param path1
   * @param path2
   */
  createRangeFromPaths(path1: number[], path2: number[]) : ModelRange {
    return ModelRange.fromPaths(this.model.rootModelNode, path1, path2);
  }

  /**
   * create a selection on the virtual dom
   * starts out without any selected ranges
   */
  createSelection() : ModelSelection {
    return new ModelSelection(this.model);
  }
}

export default RawEditor;
