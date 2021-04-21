'use strict';

module.exports = {
  extends: 'octane',
  rules: {
    'no-curly-component-invocation': {
      allow: ['unique-id'],
    },
    'no-implicit-this': {
      allow: ['unique-id'],
    }
  }
};
