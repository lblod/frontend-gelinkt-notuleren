'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const envIsProduction = process.env.EMBER_ENV === 'production';

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
    'ember-cli-babel': {
      includePolyfill: false,
      enableTypeScriptTransform: true,
    },
    minifyCSS: {
      enabled: envIsProduction,
    },
    'ember-cli-terser': {
      enabled: envIsProduction,
      exclude: ['vendor.js', 'assets/vendor.js'],
      hiddenSourceMap: envIsProduction,
    },
    sassOptions: {
      sourceMap: !envIsProduction,
      sourceMapEmbed: !envIsProduction,
      includePaths: ['node_modules/@appuniversum/ember-appuniversum'],
    },
    autoprefixer: {
      enabled: true,
      cascade: true,
      sourcemap: !envIsProduction,
    },
    sourcemaps: {
      enabled: !envIsProduction,
      extensions: ['js', 'css'],
    },
    babel: {
      sourceMaps: 'inline',
      plugins: [
        require.resolve('ember-concurrency/async-arrow-task-transform'),
      ],
    },
    fingerprint: {
      exclude: [
        'images/layers-2x.png',
        'images/layers.png',
        'images/marker-icon-2x.png',
        'images/marker-icon.png',
        'images/marker-shadow.png',
      ],
    },
  });

  return app.toTree();
};
