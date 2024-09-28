'use strict';
module.exports = function (environment) {
  const ENV = {
    modulePrefix: 'frontend-gelinkt-notuleren',
    environment,
    rootURL: '/',
    locationType: 'history',
    regulatoryStatementEndpoint: '{{REGULATORY_STATEMENT_ENDPOINT}}',
    regulatoryStatementFileEndpoint: '{{REGULATORY_STATEMENT_FILE_ENDPOINT}}',
    mowRegistryEndpoint: '{{MOW_REGISTRY_ENDPOINT}}',
    publicatieEndpoint: '{{PUBLICATIE_ENDPOINT}}',
    roadsignImageBaseUrl: '{{ROADSIGN_IMAGE_BASE_URL}}',
    fallbackCodelistEndpoint: '{{MOW_REGISTRY_ENDPOINT}}',
    zonalLocationCodelistUri: '{{ZONAL_LOCATION_CODELIST_URI}}',
    nonZonalLocationCodelistUri: '{{NON_ZONAL_LOCATION_CODELIST_URI}}',
    lmbEndpoint: '{{LMB_ENDPOINT}}',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
    },
    APP: {
      '@lblod/ember-rdfa-editor-date-plugin': {
        allowedInputDateFormats: ['DD/MM/YYYY', 'DD-MM-YYYY', 'DD.MM.YYYY'],
        outputDateFormat: 'D MMMM YYYY',
      },
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
      'editor-html-paste': true,
      'editor-extended-html-paste': true,
      'prosemirror-dev-tools': false,
      'regulatory-statements': '{{GN_FEATURE_REGULATORY_STATEMENTS}}',
    },
    browserUpdate: {
      vs: { f: -3, c: -3 },
      style: 'corner',
      l: 'nl',
      shift_page_down: false,
    },
    acmidm: {
      apiKey: '{{OAUTH_API_KEY}}',
      baseUrl: '{{OAUTH_BASE_URL}}',
      scope: 'openid rrn vo profile abb_gelinktNotuleren',
      redirectUrl: '{{OAUTH_REDIRECT_URL}}',
      logoutUrl: '{{OAUTH_LOGOUT_URL}}',
      switchRedirectUrl: '{{OAUTH_SWITCH_URL}}',
    },
    environmentName: '{{ENVIRONMENT_NAME}}',
    publication: {
      baseUrl: '{{PUBLICATION_BASE_URL}}',
    },
  };

  if (environment === 'development') {
    require('dotenv').config();
    ENV.environmentName = 'LOCAL';
    ENV.manual.baseUrl =
      'https://abb-vlaanderen.gitbook.io/gelinkt-notuleren-handleiding/';
    ENV.manual.notuleren = '#notuleren';
    ENV.manual.signing = '#ondertekenen-en-publiceren';
    ENV.manual.publish = '#ondertekenen-en-publiceren';
    ENV.manual.mandatees = '#mandatenbeheer';
    ENV.manual.signee = '#gebruikersbeheer';
    ENV.manual.publisher = '#gebruikersbeheer';
    ENV.manual.print = '';
    ENV.featureFlags['regulatory-statements'] = true;
    ENV.featureFlags['prosemirror-dev-tools'] = true;
    ENV.mowRegistryEndpoint =
      process.env.MOW_REGISTRY_SPARQL_ENDPOINT ??
      'https://dev.roadsigns.lblod.info/sparql';
    ENV.publicatieEndpoint =
      process.env.PUBLICATION_SPARQL_ENDPOINT ??
      'https://publicatie.dev.gelinkt-notuleren.lblod.info/sparql';
    ENV.roadsignImageBaseUrl =
      process.env.ROADSIGN_IMAGE_BASE_URL ??
      'https://register.mobiliteit.vlaanderen.be/';
    ENV.fallbackCodelistEndpoint =
      process.env.FALLBACK_CODELIST_SPARQL_ENDPOINT ??
      'https://dev.roadsigns.lblod.info/sparql';
    ENV.zonalLocationCodelistUri =
      'http://lblod.data.gift/concept-schemes/62331E6900730AE7B99DF7EF';
    ENV.nonZonalLocationCodelistUri =
      'http://lblod.data.gift/concept-schemes/62331FDD00730AE7B99DF7F2';
    ENV.regulatoryStatementEndpoint = new URL(
      '/raw-sparql',
      process.env.REGULATORY_STATEMENT_ENDPOINT ??
        'https://dev.reglementairebijlagen.lblod.info',
    ).toString();
    ENV.regulatoryStatementFileEndpoint = new URL(
      '/files',
      process.env.REGULATORY_STATEMENT_ENDPOINT ??
        'https://dev.reglementairebijlagen.lblod.info',
    ).toString();

    ENV.lmbEndpoint =
      process.env.LMB_ENDPOINT ?? 'https://dev.mandatenbeheer.lblod.info';
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
