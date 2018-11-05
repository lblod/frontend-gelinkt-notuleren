import Controller from '@ember/controller';
import { sort } from '@ember/object/computed';
import { computed } from '@ember/object';
export default Controller.extend({
  resultatenSortering: ['isResultaatVoor.lijstnaam'],
  resultaten: sort('model.resultaten', 'resultatenSortering'),
  zetels: computed('resultaten', function() {
    const zetels = { totaal:0};
    this.model.resultaten.forEach((r) => {
      const lijstnaam = r.get('isResultaatVoor.lijstnaam');
      if (lijstnaam in zetels) {
        zetels[lijstnaam] = zetels[lijstnaam]+1;
      }
      else {
        zetels[lijstnaam] = 1;
      }
      zetels['totaal'] = zetels['totaal'] + 1;
    });
    return zetels;
  })
});
