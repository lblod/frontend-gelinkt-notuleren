# frontend-gelinkt-notuleren

This is the Gelinkt Notuleren application implementing the ember-rdfa-editor in the domain of notulen for local governments.  For demo purposes, we advise you to run the stack as per https://github.com/lblod/app-gelinkt-notuleren.  The following describes the development setup.

## Setting up the backend

Information on setting up the backend can be found at https://github.com/lblod/app-gelinkt-notuleren

## Running the frontend

We advise the use of [edi](https://github.com/madnificent/docker-ember) but have chosen to include the default ember commands to limit confusion.

First make sure you have ember-cli installed

    npm install -g ember-cli

Next we clone this repository, install the dependencies, and boot the development server

    git clone https://github.com/lblod/frontend-gelinkt-notuleren.git
    cd frontend-gelinkt-notuleren
    
    # install the dependencies
    npm install
    
    # run the development server
    ember s --proxy http://localhost

You can visit the live reloading site at http://localhost:4200

## Configuration via docker environment variables
This frontend can be configured at runtime. It will get the environment variables prefixed by EMBER_ and match them with the variables defined in the frontend's configuration. When the docker container is started it will update /app/index.html to match the provided configuration.

### analytics through plausible
* `EMBER_ANALYTICS_APP_DOMAIN`: domain the app is deployed on, e.g. "gelinkt-notuleren.vlaanderen.be". 
* `EMBER_ANALYTICS_PLAUSIBLE_SCRIPT`: url of the script provided by your plausible instance, e.g. "https://analytics.mydomain.com/js/plausible.js"

### authentication through ACM/IDM
* `EMBER_OAUTH_API_KEY`
* `EMBER_OAUTH_BASE_URL`
* `EMBER_OAUTH_REDIRECT_URL`
* `EMBER_OAUTH_LOGOUT_URL`

### other
* `EMBER_PUBLICATION_BASE_URL`: url of the linked [publication platform](https://github.com/lblod/app-gn-publicatie/), e.g. "https://publicatie.gelinkt-notuleren.vlaanderen.be/"
* `EMBER_ENVIRONMENT_NAME`: name of the environment, appended to the document title.
