'use strict';

module.exports = function(environment) {
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
        Date: false
      }
    },
    APP: {
      '@lblod/ember-rdfa-editor-date-plugin': {
        allowedInputDateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY',  'DD.MM.YYYY'],
        outputDateFormat: 'D MMMM YYYY'
      }
    },
    featureFlags: {
      'language-select': false,
      'editor-html-paste': true
    },
    browserUpdate: {
      vs: {f:-3,o:-3,s:-3,c:-3},
      style: 'corner',
      l: 'nl',
      shift_page_down: false
    },
    moment: {
      outputFormat: 'DD-MM-YYYY hh:mm:ss',
      includeTimezone: 'subset',
      includeLocales: ['nl'],
      allowEmpty: true
    },
    torii: {
      disableRedirectInitializer: true,
      providers: {
        'acmidm-oauth2': {
          apiKey: '68b1585d-0e13-4817-820e-c475207673ed',
          baseUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/auth',
          scope: 'openid rrn vo profile abb_gelinktNotuleren',
          redirectUri: 'https://gelinkt-notuleren.lblod.info/authorization/callback',
          logoutUrl: 'https://authenticatie-ti.vlaanderen.be/op/v1/logout'
        }
      }
    },
    'vo-webuniversum': {
      version: '2.8.3',
      header: '//widgets.vlaanderen.be/widget/live/5d47450609154d5c86f588f3b36ce9ba',
      footer: '//widgets.vlaanderen.be/widget/live/a6670dda202e46beb2832ae8f57f197e'
    },
    publicatie: {
      baseUrl: 'https://publicatie.gelinkt-notuleren.lblod.info/'
    }
  };

  if (environment === 'development') {
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
  }

  if (environment === 'production') {

  }

  if (process.env.DEPLOY_ENV === 'production') {
    ENV['torii']['providers']['acmidm-oauth2']['apiKey'] = 'a004bb30-e68b-476b-a67d-121276c2b944';
    ENV['torii']['providers']['acmidm-oauth2']['baseUrl'] = 'https://authenticatie.vlaanderen.be/op/v1/auth';
    ENV['torii']['providers']['acmidm-oauth2']['redirectUri'] = 'https://gelinkt-notuleren.vlaanderen.be/authorization/callback';
    ENV['torii']['providers']['acmidm-oauth2']['logoutUrl'] = 'https://authenticatie.vlaanderen.be/op/v1/logout';
    ENV['vo-webuniversum']['header'] = '//widgets.vlaanderen.be/widget/live/423fc174cf074c52a9ffd3251cc2a72e';
    ENV['vo-webuniversum']['footer'] = '//widgets.vlaanderen.be/widget/live/3a70f9cfd28e44e5949e79a438eeeb8d';
    ENV['publicatie']['baseUrl'] = 'https://publicatie.gelinkt-notuleren.vlaanderen.be/';
  }

  return ENV;
};
