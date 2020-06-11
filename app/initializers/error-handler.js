import Ember from 'ember'

export function initialize(/* application */) {
  Ember.onerror= (error) => {
    console.log('Error catched by the error handler');
    console.log(error);
  };
}

export default {
  initialize
};
