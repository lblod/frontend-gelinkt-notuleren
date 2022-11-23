'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const envIsProduction = process.env.EMBER_ENV === 'production';
const webpack = require('webpack');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-simple-auth': {
      useSessionSetupMethod: true,
    },
    'ember-cli-babel': {
      includePolyfill: false,
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
      includePaths: ['node_modules/'],
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
    },
    autoImport: {
      webpack: {
        plugins: [
          //This is for the besluit-type-plugin. The SPARQL fetcher is made compatible with an older version of Webpack where this module was packaged by default.
          new webpack.ProvidePlugin({
            process: 'process/browser',
          }),
          new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
          }),
        ],
      },
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
