/**
 * @typedef {import('../models/installatievergadering').default} InstallatieVergaderingModel
 * @typedef {import('../models/bestuursorgaan').default} BestuursorgaanModel
 * @typedef {import('../services/template-fetcher').default} TemplateFetcher
 */

import { RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN } from '../utils/classification-utils';
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';
import { MapWithDefault } from '../utils/map-with-default';

/**
 * @typedef {Object} CreateInstallatievergaderingOptions
 * @property {BestuursorgaanModel} bestuursorgaan
 * @property {TemplateFetcher} templateFetcher
 * @property {string} location
 * @property {string} plannedStart
 */

/**
 * @param {import('@ember-data/store').default} store
 * @param {CreateInstallatievergaderingOptions} options
 * @returns {Promise<InstallatieVergaderingModel>}
 */
export async function createInstallatievergadering(
  store,
  { bestuursorgaan, templateFetcher, location, plannedStart },
) {
  const meeting = store.createRecord('installatievergadering', {
    geplandeStart: plannedStart,
    gestartOpTijdstip: plannedStart,
    opLocatie: location,
    bestuursorgaan,
  });
  await meeting.save();

  const templateSpecs = await getSpec(bestuursorgaan);
  const promises = [];
  let previousAgendapoint;
  for (let i = 0; i < templateSpecs.length; i++) {
    const agendapoint = store.createRecord('agendapunt', {
      position: i,
      geplandOpenbaar: true,
      titel: templateSpecs[i].apTitle,
      zitting: meeting,
      vorigeAgendapunt: previousAgendapoint,
    });
    const treatment = store.createRecord('behandeling-van-agendapunt', {
      openbaar: true,
      onderwerp: agendapoint,
    });
    const template = await templateFetcher.fetchByTemplateName({
      name: templateSpecs[i].templateTitle,
    });
    await template.loadBody();
    promises.push(
      agendapoint.save(),
      treatment
        .initializeDocument(templateUuidInstantiator(template.body))
        .then(() => treatment.saveAndPersistDocument()),
    );
    previousAgendapoint = agendapoint;
  }
  await Promise.all(promises);
  await meeting.save();
  return meeting;
}
/**
 * @param {BestuursorgaanModel} bestuursorgaan
 * @returns {Promise<boolean>}
 */
async function isRMW(bestuursorgaan) {
  const baseBody = await bestuursorgaan.isTijdsspecialisatieVan;
  const classification = await baseBody.classificatie;
  return classification.uri === RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN;
}
/**
 * @param {BestuursorgaanModel} bestuursorgaan
 * @returns {Promise<string>}
 */
async function getMunicipality(bestuursorgaan) {
  const baseBody = await bestuursorgaan.isTijdsspecialisatieVan;
  const unit = await baseBody.bestuurseenheid;
  return unit.naam;
}

/**
 * @param {BestuursorgaanModel} bestuursorgaan
 * @returns {Promise<TemplateSpec[]>}
 */
async function getSpec(bestuursorgaan) {
  const municipality = await getMunicipality(bestuursorgaan);

  const spec = MUNICIPALITY_CONFIG.get(municipality);

  if (await isRMW(bestuursorgaan)) {
    return spec.rmw;
  }
  return spec.gemeenteraad;
}

/**
 * @typedef {Object} TemplateSpec
 * @property {string} templateTitle
 * @property {string} apTitle
 */
/** @type {TemplateSpec[]} */
const IVGR_MAP = [
  {
    templateTitle: 'IVGR1 Kennisname van de definitieve verkiezingsuitslag',
    apTitle: 'Kennisname van de definitieve verkiezingsuitslag',
  },
  {
    templateTitle: 'IVGR2 Onderzoek van de geloofsbrieven',
    apTitle: 'Onderzoek van de geloofsbrieven',
  },
  {
    templateTitle: 'IVGR3 Eedaflegging van de verkozen gemeenteraadsleden',
    apTitle: 'Eedaflegging van de verkozen gemeenteraadsleden',
  },
  {
    templateTitle: 'IVGR4 Bepaling van de rangorde van de gemeenteraadsleden',
    apTitle: 'Bepaling van de rangorde van de gemeenteraadsleden',
  },
  {
    templateTitle: 'IVGR5 Vaststelling van de fracties',
    apTitle: 'Vaststelling van de fracties',
  },
  {
    templateTitle: 'IVGR6 Verkiezing van de voorzitter van de gemeenteraad',
    apTitle: 'Verkiezing van de voorzitter van de gemeenteraad',
  },
  {
    templateTitle: 'IVGR7 Verkiezing van de schepenen',
    apTitle: 'Verkiezing van de schepenen',
  },
  {
    templateTitle:
      'IVGR8 Aanduiding en eedaflegging van de aangewezen-burgemeester',
    apTitle: 'Aanduiding en eedaflegging van de aangewezen-burgemeester',
  },
];

/** @type {TemplateSpec[]} */
const IVGR_FUSIE_MAP = [
  {
    templateTitle: 'IVFUSIE1 Kennisname van de definitieve verkiezingsuitslag',
    apTitle: 'Kennisname van de definitieve verkiezingsuitslag',
  },
  {
    templateTitle: 'IVFUSIE2 Onderzoek van de geloofsbrieven',
    apTitle: 'Onderzoek van de geloofsbrieven',
  },
  {
    templateTitle: 'IVFUSIE3 Eedaflegging van de verkozen gemeenteraadsleden',
    apTitle: 'Eedaflegging van de verkozen gemeenteraadsleden',
  },
  {
    templateTitle:
      'IVFUSIE4 Bepaling van de rangorde van de gemeenteraadsleden',
    apTitle: 'Bepaling van de rangorde van de gemeenteraadsleden',
  },
  {
    templateTitle: 'IVFUSIE5 Vaststelling van de fracties',
    apTitle: 'Vaststelling van de fracties',
  },
  {
    templateTitle: 'IVFUSIE6 Verkiezing van de voorzitter van de gemeenteraad',
    apTitle: 'Verkiezing van de voorzitter van de gemeenteraad',
  },
  {
    templateTitle: 'IVFUSIE7 Verkiezing van de schepenen',
    apTitle: 'Verkiezing van de schepenen',
  },
  {
    templateTitle:
      'IVFUSIE8 Aanduiding en eedaflegging van de aangewezen-burgemeester',
    apTitle: 'Aanduiding en eedaflegging van de aangewezen-burgemeester',
  },
];
/** @type {TemplateSpec[]} */
const IVGR_POLITIERAAD_MAP = [
  ...IVGR_MAP,
  {
    templateTitle: 'IVGR9 Verkiezing van de politieraadsleden',
    apTitle: 'Verkiezing van de politieraadsleden',
  },
];

/** @type {TemplateSpec[]} */
const IVGR_FUSIE_POLITIERAAD_MAP = [
  ...IVGR_FUSIE_MAP,
  {
    templateTitle:
      'IVFUSIE9 Verkiezing van de vertegenwoordigers van de politieraad',
    apTitle: 'Verkiezing van de vertegenwoordigers van de politieraad',
  },
];

/** @type {TemplateSpec[]} */
const IVRMW_MAP = [
  {
    templateTitle:
      'IVRMW1 Verkiezing van de voorzitter van het bijzonder comité voor de sociale dienst',
    apTitle:
      'Verkiezing van de voorzitter van het bijzonder comité voor de sociale dienst',
  },
  {
    templateTitle:
      'IVRMW2 Verkiezing van de leden van het bijzonder comité voor de sociale dienst',
    apTitle:
      'Verkiezing van de leden van het bijzonder comité voor de sociale dienst',
  },
];

const MUNICIPALITY_CONFIG = new MapWithDefault({
  gemeenteraad: IVGR_POLITIERAAD_MAP,
  rmw: IVRMW_MAP,
});

// Set-up 'gemeenten' that do not have a 'politieraad'
MUNICIPALITY_CONFIG.batchSet(
  [
    'Voeren',
    'Ronse',
    'Brasschaat',
    'Schoten',
    'Lier',
    'Heist-op-den-Berg',
    'Lommel',
    'Heusden-Zolder',
    'Leuven',
    'Aarschot',
    'Zaventem',
    'Dilbeek',
    'Grimbergen',
    'Gent',
    'Sint-Niklaas',
    'Aalst',
    'Ninove',
    'Dendermonde',
    'Brugge',
    'Oostende',
    'Middelkerke',
  ],
  {
    gemeenteraad: IVGR_MAP,
    rmw: IVRMW_MAP,
  },
);

// Set-up 'fusiegemeenten' that have a 'politieraad'
MUNICIPALITY_CONFIG.batchSet(
  [
    'Merelbeke-Melle',
    'Nazareth-De Pinte',
    'Pajottegem',
    'Tessenderlo-Ham',
    'Tielt',
    'Lochristi',
    'Hasselt',
    'Beveren-Kruibeke-Zwijndrecht',
    'Wingene',
    'Tongeren-Borgloon',
    'Bilzen-Hoeselt',
  ],
  {
    gemeenteraad: IVGR_FUSIE_POLITIERAAD_MAP,
    rmw: IVRMW_MAP,
  },
);

// Set-up 'fusiegemeenten' without a 'politieraad'
MUNICIPALITY_CONFIG.batchSet(['Lokeren', 'Antwerpen'], {
  gemeenteraad: IVGR_FUSIE_MAP,
  rmw: IVRMW_MAP,
});
