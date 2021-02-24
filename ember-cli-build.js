'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-babel': {
      includePolyfill: true
    },
    minifyCSS: {
      enabled: false
    },
    'ember-cli-terser': {
      exclude: ['vendor.js', 'assets/vendor.js'],
      terser: {
        compress: {
          collapse_vars: false
        },
      },
    },
    sassOptions: {
      sourceMapEmbed: true,
      includePaths: [
        'node_modules/@appuniversum/appuniversum',
        'node_modules/@appuniversum/ember-appuniversum/app/styles'
      ]
    },
    autoprefixer: {
      enabled: true,
      cascade: true,
      sourcemap: true
    },
    flatpickr: {
      locales: ['nl'],
      theme: 'light'
    },
    sourcemaps: {
      enabled: true,
      extensions: ['js']
    },
    babel: {
      sourceMaps: 'inline'
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
