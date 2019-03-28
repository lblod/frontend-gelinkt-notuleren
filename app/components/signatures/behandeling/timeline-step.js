import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  /** Name of the resource to sign/publish (e.g. 'ontwerpagenda', 'aanvullende agenda', ... */
  name: null,
  /** Name of the current selected step */
  step: null,
  /** Versioned behandeling to be signed/published */
  behandeling: null,
  /** Function to trigger the signing of the agenda */
  sign: null,
  /** Function to trigger the publication of the agenda */
  publish: null,
  /** Function to trigger the printing of the document */
  print: null
});
