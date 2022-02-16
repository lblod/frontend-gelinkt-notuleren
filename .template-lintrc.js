'use strict';

module.exports = {
  extends: 'recommended',
  rules: {
    'no-curly-component-invocation': {
      allow: ['unique-id'],
    },
    'no-implicit-this': {
      allow: ['unique-id'],
    }
  }
};
