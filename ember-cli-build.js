'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
const envIsProduction = process.env.EMBER_ENV === 'production';
const webpack = require('webpack');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    '@appuniversum/ember-appuniversum': {
      disableWormholeElement: true,
    },
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

  return app.toTree();
};
