import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';
import { Schema } from 'prosemirror-model';
import {
  em,
  strikethrough,
  strong,
  underline,
} from '@lblod/ember-rdfa-editor/plugins/text-style';
import {
  blockRdfaWithConfig,
  docWithConfig,
  hard_break,
  horizontal_rule,
  paragraph,
  repairedBlockWithConfig,
  text,
} from '@lblod/ember-rdfa-editor/nodes';

import { code } from '@lblod/ember-rdfa-editor/plugins/code/marks/code';
import {
  bulletListWithConfig,
  listItemWithConfig,
  orderedListWithConfig,
} from '@lblod/ember-rdfa-editor/plugins/list';
import { tableNodes } from '@lblod/ember-rdfa-editor/plugins/table';
import { image } from '@lblod/ember-rdfa-editor/plugins/image';
import { blockquote } from '@lblod/ember-rdfa-editor/plugins/blockquote';
import { headingWithConfig } from '@lblod/ember-rdfa-editor/plugins/heading';
import { code_block } from '@lblod/ember-rdfa-editor/plugins/code';
import { invisible_rdfa } from '@lblod/ember-rdfa-editor/nodes/invisible-rdfa';
import { inline_rdfa } from '@lblod/ember-rdfa-editor/marks';

/**
 * Utility to get the editor element in a type-safe way
 * This avoids having to nullcheck everywhere where a null editor would be an error anyway.
 * @returns the editor element
 */
export function getEditorElement(): Element {
  const editor = document.querySelector('div[contenteditable]');
  if (!editor) throw new Error('Editor element not found in dom');
  return editor;
}

/**
 * Promise which waits for ms milliseconds
 * @param ms number of milliseconds to wait
 * @returns A Promise which waits for ms milliseconds
 */
export function delayMs(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

/**
 * Setup and render the editor
 * @returns A promise which renders the editor
 */
export async function renderEditor() {
  await render(hbs`
      <Editor
              @rdfaEditorInit={{this.rdfaEditorInit}}
              @profile="default"
              class="rdfa-playground"
              @editorOptions={{hash showToggleRdfaAnnotations="true" showInsertButton=null showRdfa="true"
                                    showRdfaHighlight="true" showRdfaHover="true"}}
              @toolbarOptions={{hash showTextStyleButtons="true" showListButtons="true" showIndentButtons="true"}}
      />`);
  return getEditorElement();
}

const nodes = {
  doc: docWithConfig({ rdfaAware: true }),
  paragraph,

  repaired_block: repairedBlockWithConfig({ rdfaAware: true }),

  list_item: listItemWithConfig(),
  ordered_list: orderedListWithConfig(),
  bullet_list: bulletListWithConfig(),
  ...tableNodes({
    tableGroup: 'block',
    cellContent: 'inline*',
  }),
  heading: headingWithConfig({ rdfaAware: true }),
  blockquote,

  horizontal_rule,
  code_block,

  text,

  image,

  hard_break,
  invisible_rdfa,
  block_rdfa: blockRdfaWithConfig({ rdfaAware: true }),
};
const marks = {
  inline_rdfa,
  code,
  em,
  strong,
  underline,
  strikethrough,
};

const TEST_SCHEMA = new Schema({ nodes, marks });
export default TEST_SCHEMA;
