# frontend-gelinkt-notuleren

This is the Gelinkt Notuleren application implementing the ember-rdfa-editor in the domain of notulen for local governments.  For demo purposes, we advise you to run the stack as per https://github.com/lblod/app-demo-editor.  The following describes the development setup.

## Setting up the backend

Information on setting up the backend can be found at https://github.com/lblod/app-demo-editor

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
