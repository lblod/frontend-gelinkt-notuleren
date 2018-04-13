//PLEASE NOTE: a copy from https://github.com/lblod/ember-contenteditable-editor/blob/master/addon/utils/dom-helpers.js
// everyone moaning about too many addons

/**
 * dom helper to remove a node from the dom tree
 * this inserts replaces the node with its child nodes
 *
 * @method removeNodeFromTree
 * @static
 * @param {DOMNode} node
 * @public
 */
const removeNodeFromTree = function removeNodeFromTree(node) {
  let parent = node.parentNode;
  let baseNode = node;
  while (node.childNodes && node.childNodes.length > 0) {
    let nodeToInsert = node.childNodes[node.childNodes.length - 1];
    parent.insertBefore(nodeToInsert, baseNode);
    baseNode = nodeToInsert;
  }
  parent.removeChild(node);
};

export {
  removeNodeFromTree,
};
