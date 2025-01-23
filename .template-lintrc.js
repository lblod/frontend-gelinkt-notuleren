'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': {
      allow: ['unique-id'],
    },
    'no-implicit-this': {
      allow: ['unique-id'],
    },
    'no-bare-strings': true,
    // FIXME We should migrate away from using did-insert and did-update
    'no-at-ember-render-modifiers': false,
    // FIXME We only use Input in table-menu, we should refactor to use <input>
    'no-builtin-form-components': false,
  },
};
