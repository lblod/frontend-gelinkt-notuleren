import { Factory } from 'miragejs';
import { type Measure, type ArDesign } from './models';

export default {
  arDesign: Factory.extend<Partial<ArDesign>>({
    uri(i) {
      return `http://mirage.example/ar-designs/${i + 1}`;
    },
    date() {
      return new Date().toLocaleDateString();
    },
    name(i) {
      return `AR Design ${i + 1}`;
    },
  }),
  measure: Factory.extend<Partial<Measure>>({
    templateString(id) {
      return `Template ${id}`;
    },
    variables() {
      return [];
    },
  }),
};
