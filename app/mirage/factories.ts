import { Factory } from 'miragejs';
import { type Measure, type ArDesign } from './models';
import { faker } from '@faker-js/faker';

const MEASURE_SAMPLE_DATA: Partial<Measure>[] = [
  {
    rawTemplateString:
      '${locatie} \n${E9d}; \n${GVIId}; \n${GXa}; \n${GXd}; \n${GXb}.',
    templateString:
      '${locatie} \nhet parkeren is voorbehouden voor autocars; \nhet parkeren is voorbehouden voor ${categorie_voertuig}; \nhet begin van de parkeerreglementering wordt aangeduid; \nde parkeerreglementering geldt over een afstand van meer dan 300 meter; \nhet einde van de parkeerreglementering wordt aangeduid.',
  },
  {
    rawTemplateString: '${locatie} \n${E9e}; \n${GVIId}; \n${GXc}.',
    templateString:
      '${locatie} \nhet is verplicht te parkeren op de berm of op het trottoir; \nhet parkeren is betalend; \nhet betalend parkeren geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.',
  },
  {
    rawTemplateString: '${locatie} \n${E9i}; \n${GVIId}; \n${GXa}; \n${GXb}.',
    templateString:
      '${locatie} \nhet parkeren is voorbehouden voor motorfietsen; \nhet parkeren is voorbehouden voor ${categorie_voertuig}; \nhet begin van de parkeerreglementering wordt aangeduid; \nhet einde van de parkeerreglementering wordt aangeduid.',
  },
  {
    rawTemplateString:
      '${locatie} \n${E9e}; \n${GVIIb}; \n${GXa}; \n${GXd}; \n${GXb}.',
    templateString:
      '${locatie} \nhet is verplicht te parkeren op de berm of op het trottoir; \nde parkeertijd is beperkt en de parkeerschijf moet gebruikt worden;\nhet gebruik van de schijf is voorgeschreven ${bijzondere_voorwaarden_gebruik_parkeerschijf};\nde beperkte parkeertijd geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nhet begin van de parkeerreglementering wordt aangeduid; \nde parkeerreglementering geldt over een afstand van meer dan 300 meter; \nhet einde van de parkeerreglementering wordt aangeduid.',
  },
  {
    rawTemplateString: '${locatie} \n${E9i}; \n${GVIId}; \n${GXc}.',
    templateString:
      '${locatie} \nhet parkeren is voorbehouden voor motorfietsen; \nhet parkeren is betalend; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.',
  },
  {
    rawTemplateString: '${locatie} \n${E9c}; \n${GVIId}; \n${GXc}.',
    templateString:
      "${locatie} \nhet parkeren is voorbehouden voor lichte vrachtauto's en vrachtauto's; \nhet parkeren is voorbehouden voor ${categorie_voertuig}; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.",
  },
  {
    rawTemplateString: '${locatie} \n${E9d}; \n${GVIIb}; \n${GXc}.',
    templateString:
      '${locatie} \nhet parkeren is voorbehouden voor autocars; \nde parkeertijd is beperkt en de parkeerschijf moet gebruikt worden;\nde beperkte parkeertijd geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.',
  },
  {
    rawTemplateString: '${locatie} \n${F1a}; \n${F3a}.',
    templateString:
      '${locatie} \nde bebouwde kom ${naam_bebouwde_kom} wordt afgebakend. Het begin van de bebouwde kom wordt aangeduid; \nook het einde van de bebouwde kom wordt aangeduid.',
  },
  {
    rawTemplateString:
      '${locatie} \n${E1}; \n${GVIId}; \n${GXa}; \n${GXd}; \n${GXb}.',
    templateString:
      '${locatie} \nhet parkeren is verboden; \nhet verbod geldt voor ${categorie_voertuig}; \nhet begin van de parkeerreglementering wordt aangeduid; \nde parkeerreglementering geldt over een afstand van meer dan 300 meter; \nhet einde van de parkeerreglementering wordt aangeduid.',
  },
  {
    rawTemplateString:
      '${locatie} \n${E9a}; \n${GVIId}; \n${GXa}; \n${Parkeerautomaat}.',
    templateString:
      '${locatie} \nhet parkeren is toegelaten; \nhet parkeren is betalend; \nhet betalend parkeren geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nhet begin van de parkeerreglementering wordt aangeduid; \nbestuurders moeten parkeren op de wijze en onder de voorwaarden die op de parkeerautomaat zijn vermeld.',
  },
  {
    rawTemplateString:
      '${locatie} \n${E9h}; \n${GVIId}; \n${GXa}; \n${Parkeerautomaat}. ',
    templateString:
      "${locatie} \nhet parkeren is voorbehouden voor kampeerauto's; \n${GVIId}; \n${GXa}; \n${Parkeerautomaat}. ",
  },
  {
    rawTemplateString: '${locatie} \n${E9b}; \n${GVIIb}; \n${GXc}.',
    templateString:
      "${locatie} \nhet parkeren is voorbehouden voor motorfietsen, personenauto's, auto's voor dubbel gebruik en minibussen; \nde parkeertijd is beperkt en de parkeerschijf moet gebruikt worden;\nhet gebruik van de schijf is voorgeschreven ${bijzondere_voorwaarden_gebruik_parkeerschijf};\nde beperkte parkeertijd geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.",
  },
  {
    rawTemplateString: '${locatie} \n${E9e}; \n${GVIIb}; \n${GXa}; \n${GXb}.',
    templateString:
      '${locatie} \nhet is verplicht te parkeren op de berm of op het trottoir; \nde parkeertijd is beperkt en de parkeerschijf moet gebruikt worden; \nhet begin van de parkeerreglementering wordt aangeduid; \nhet einde van de parkeerreglementering wordt aangeduid.',
  },
  {
    rawTemplateString:
      '${locatie} \n${E9c}; \n${GVIId}; \n${GXa}; \n${GXd}; \n${GXb}.',
    templateString:
      "${locatie} \nhet parkeren is voorbehouden voor lichte vrachtauto's en vrachtauto's; \nhet parkeren is betalend; \nhet begin van de parkeerreglementering wordt aangeduid; \nde parkeerreglementering geldt over een afstand van meer dan 300 meter; \nhet einde van de parkeerreglementering wordt aangeduid.",
  },
  {
    rawTemplateString:
      '${locatie} \n${E5}; \n${GXa}; \n${GXb}.\n${locatie2} \n${E7}; \n${GXa}; \n${GXb}.',
    templateString:
      '${locatie} \nhet parkeren is verboden van de 1e tot de 15e van de maand; \nhet begin van de parkeerreglementering wordt aangeduid; \nhet einde van de parkeerreglementering wordt aangeduid.\n${locatie2} \nhet parkeren is verboden van de 16e tot het einde van de maand; \nhet begin van de parkeerreglementering wordt aangeduid; \nhet einde van de parkeerreglementering wordt aangeduid.',
  },
  {
    rawTemplateString:
      '${locatie} \n${E5}; \n${GVIId}; \n${GXc}.\n${locatie2} \n${E7}; \n${GVIId}; \n${GXc}.',
    templateString:
      '${locatie} \nhet parkeren is verboden van de 1e tot de 15e van de maand; \nhet parkeren is betalend; \nhet betalend parkeren geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.\n${locatie2} \nhet parkeren is verboden van de 16e tot het einde van de maand; \nhet parkeren is betalend; \nhet betalend parkeren geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nde parkeerreglementering geldt over een afstand van ${aanduiding_afstand} m.',
  },
  {
    rawTemplateString: '${locatie} \n${E9a}; \n${GVIId}.',
    templateString:
      '${locatie} \nhet parkeren is toegelaten; \nhet parkeren is betalend; \nhet betalend parkeren geldt niet voor personen in het bezit van een ${type_parkeerkaart}.',
  },
  {
    rawTemplateString: '${locatie} \n${E9d}; \n${GVIIb}.',
    templateString:
      '${locatie} \nhet parkeren is voorbehouden voor autocars; \nde parkeertijd is beperkt en de parkeerschijf moet gebruikt worden;\nhet gebruik van de schijf is voorgeschreven ${bijzondere_voorwaarden_gebruik_parkeerschijf};\nde beperkte parkeertijd geldt niet voor personen in het bezit van een ${type_parkeerkaart}.',
  },
  {
    rawTemplateString:
      '${locatie} \n${B5}; \n${M9}; \n${WM76.1}. \n${locatie2} \n${B9}\n${locatie3} \n${B11}.',
    templateString:
      '${locatie} \n${B5}; \n${M9}; \n${WM76.1}. \n${locatie2} \nde voorrangsweg wordt aangeduid\n${locatie3} \n${B11}.',
  },
  {
    rawTemplateString: '${locatie} \n${E9a}; \n${GVIIb}; \n${GXa};\n${GXb}.',
    templateString:
      '${locatie} \nhet parkeren is toegelaten; \nde parkeertijd is beperkt en de parkeerschijf moet gebruikt worden;\nde beperkte parkeertijd geldt niet voor personen in het bezit van een ${type_parkeerkaart}; \nhet begin van de parkeerreglementering wordt aangeduid;\nhet einde van de parkeerreglementering wordt aangeduid.',
  },
];

export default {
  arDesign: Factory.extend<Partial<ArDesign>>({
    uri(i) {
      return `http://mirage.example/ar-designs/${i + 1}`;
    },
    date() {
      return faker.date
        .past({
          years: 1,
        })
        .toLocaleString();
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
