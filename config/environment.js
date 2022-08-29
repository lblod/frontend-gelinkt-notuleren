'use strict';

// const mainPjson = require('../package.json');
// const fs = require('fs');

// function isUrl(string) {
//   try {
//     const url = new URL(string);
//     return url.protocol === 'http:' || url.protocol === 'https:';
//   } catch (e) {
//     return false;
//   }
// }

// function extractRepoUrl(pjson) {
//   const repo = pjson.repository;
//   let url;
//   if (typeof repo === 'string') {
//     url = repo.replace('git+', '');
//   } else if (typeof repo === 'object') {
//     url = repo?.url?.replace('git+', '');
//   }
//   if (url && isUrl(url)) {
//     return url;
//   }
// }
// function getPackages() {
//   const packages = {
//     [mainPjson.name]: {
//       version: mainPjson.version,
//       url: extractRepoUrl(mainPjson),
//     },
//   };
//   const dirs = fs
//     .readdirSync('node_modules/@lblod')
//     .filter((dir) => dir.startsWith('ember-rdfa-editor'));
//   dirs.forEach((dir) => {
//     const file = `../node_modules/@lblod/${dir}/package.json`;
//     const pjson = require(file);
//     packages[pjson.name] = {
//       version: pjson.version,
//       url: extractRepoUrl(pjson),
//     };
//   });
//   return packages;
// }

module.exports = function (environment) {
  // const editorDeps = getPackages();
  let ENV = {
    modulePrefix: 'frontend-gelinkt-notuleren',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },
    APP: {
      '@lblod/ember-rdfa-editor-date-plugin': {
        allowedInputDateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY'],
        outputDateFormat: 'D MMMM YYYY',
      },
      // packages: {
      //   ...editorDeps,
      // },
    },
    roadsignRegulationPlugin: {
      endpoint: '{{MOW_REGISTRY_ENDPOINT}}',
    },
    templateVariablePlugin: {
      endpoint: '{{MOW_REGISTRY_ENDPOINT}}',
    },
    'ember-plausible': {
      enabled: false,
      domain: '{{PLAUSIBLE_APP_DOMAIN}}',
      apiHost: '{{PLAUSIBLE_API_ENDPOINT}}',
      trackLocalhost: true,
      hashMode: false,
      enableAutoPageviewTracking: true,
      enableAutoOutboundTracking: true,
    },
    manual: {
      baseUrl: '{{MANUAL_BASE_URL}}',
      notuleren: '{{MANUAL_NOTULEREN}}',
      signing: '{{MANUAL_SIGNING}}',
      publish: '{{MANUAL_PUBLISH}}',
      mandatees: '{{MANUAL_MANDATEES}}',
      signee: '{{MANUAL_SIGNEE}}',
      publisher: '{{MANUAL_PUBLISHER}}',
      print: '{{MANUAL_PRINT}}',
    },
    featureFlags: {
      'language-select': false,
      'editor-html-paste': true,
      'editor-extended-html-paste': true,
      'acmidm-switch': true,
      attachments: true,
    },
    browserUpdate: {
      vs: { f: -3, c: -3 },
      style: 'corner',
      l: 'nl',
      shift_page_down: false,
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: '{{OAUTH_API_KEY}}',
          baseUrl: '{{OAUTH_BASE_URL}}',
          scope: 'openid rrn vo profile abb_gelinktNotuleren',
          redirectUri: '{{OAUTH_REDIRECT_URL}}',
          logoutUrl: '{{OAUTH_LOGOUT_URL}}',
          returnUrl: '{{OAUTH_SWITCH_URL}}',
        },
      },
    },
    environmentName: '{{ENVIRONMENT_NAME}}',
    publication: {
      baseUrl: '{{PUBLICATION_BASE_URL}}',
    },
  };

  if (environment === 'development') {
    ENV.manual.baseUrl =
      'https://abb-vlaanderen.gitbook.io/gelinkt-notuleren-handleiding/';
    ENV.manual.notuleren = '#notuleren';
    ENV.manual.signing = '#ondertekenen-en-publiceren';
    ENV.manual.publish = '#ondertekenen-en-publiceren';
    ENV.manual.mandatees = '#mandatenbeheer';
    ENV.manual.signee = '#gebruikersbeheer';
    ENV.manual.publisher = '#gebruikersbeheer';
    ENV.manual.print = '';
    ENV.featureFlags.attachments = true;
    ENV.roadsignRegulationPlugin.endpoint =
      'https://dev.roadsigns.lblod.info/sparql';
    ENV.templateVariablePlugin.endpoint =
      'https://dev.roadsigns.lblod.info/sparql';
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // Production build specific configuration
  }

  return ENV;
};
