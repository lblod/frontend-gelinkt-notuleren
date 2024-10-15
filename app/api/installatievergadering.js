/**
 * @typedef {import('../models/installatievergadering').default} InstallatieVergaderingModel
 * @typedef {import('../models/bestuursorgaan').default} BestuursorgaanModel
 * @typedef {import('../services/template-fetcher').default} TemplateFetcher
 */

import { RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN } from '../utils/classification-utils';

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
  const now = new Date();

  const meeting = store.createRecord('installatievergadering', {
    geplandeStart: plannedStart,
    gestartOpTijdstip: now,
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
        .initializeDocument(template.body)
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

  const spec = MUNICIPALITY_CONFIG[municipality] ?? DEFAULT_MUNICIPALITY_SPEC;

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
const IVGR_FACILITEITEN_MAP = [
  {
    templateTitle:
      'IVGRFac1 Kennisname van de definitieve verkiezingsuitslag DUMMY',
    apTitle: 'Kennisname van de definitieve verkiezingsuitslag faciliteiten',
  },
];

/** @type {TemplateSpec[]} */
const IVGR_FUSIE_MAP = [
  {
    templateTitle:
      'IVGRFusie1 Kennisname van de definitieve verkiezingsuitslag DUMMY',
    apTitle: 'Kennisname van de definitieve verkiezingsuitslag fusie',
  },
];
/** @type {TemplateSpec[]} */
const IVGR_VOEREN_MAP = [
  {
    templateTitle:
      'IVGRVoeren1 Kennisname van de definitieve verkiezingsuitslag DUMMY',
    apTitle: 'Kennisname van de definitieve verkiezingsuitslag voeren',
  },
];
/** @type {TemplateSpec[]} */
const IVGR_POLITIERAAD_MAP = [
  ...IVGR_MAP,
  {
    templateTitle: 'IVGR9 Samenstelling van de politieraad DUMMY',
    apTitle: 'Samenstelling van de politieraad',
  },
];

/** @type {TemplateSpec[]} */
const IVRMW_MAP = [
  {
    templateTitle: 'IVRW1 DUMMY IV RMW',
    apTitle: 'Samenstelling van Raad maatschappelijk welzijn',
  },
];
/** @type {TemplateSpec[]} */
const IVRMW_FACILITEITEN_MAP = [
  {
    templateTitle: 'IVRWFac1 DUMMY IV RMW',
    apTitle: 'Samenstelling van Raad maatschappelijk welzijn faciliteiten',
  },
];
/** @type {TemplateSpec[]} */
const IVRMW_FUSIE_MAP = [
  {
    templateTitle: 'IVRWFusie1 DUMMY IV RMW',
    apTitle: 'Samenstelling van Raad maatschappelijk welzijn fusie',
  },
];
/** @type {TemplateSpec[]} */
const IVRMW_VOEREN_MAP = [
  {
    templateTitle: 'IVRWVoeren1 DUMMY IV RMW',
    apTitle: 'Samenstelling van Raad maatschappelijk welzijn voeren',
  },
];
/**
 * @typedef {Object} MunicipalitySpec
 * @property {TemplateSpec[]} gemeenteraad
 * @property {TemplateSpec[]} rmw
 */

/** @type { Record<string, MunicipalitySpec> } */
const MUNICIPALITY_CONFIG = {
  Aalst: { gemeenteraad: IVGR_POLITIERAAD_MAP, rmw: IVRMW_MAP },
  Voeren: { gemeenteraad: IVGR_VOEREN_MAP, rmw: IVRMW_VOEREN_MAP },
  Bever: { gemeenteraad: IVGR_FACILITEITEN_MAP, rmw: IVRMW_FACILITEITEN_MAP },
  Drogenbos: {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
  Herstappe: {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
  Kraainem: {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
  Linkebeek: {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
  Mesen: { gemeenteraad: IVGR_FACILITEITEN_MAP, rmw: IVRMW_FACILITEITEN_MAP },
  Ronse: { gemeenteraad: IVRMW_FACILITEITEN_MAP, rmw: IVRMW_FACILITEITEN_MAP },
  'Sint-Genesius-Rode': {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
  'Spiere-Helkijn': {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
  Wemmel: { gemeenteraad: IVGR_FACILITEITEN_MAP, rmw: IVRMW_FACILITEITEN_MAP },
  'Wezembeek-Oppem': {
    gemeenteraad: IVGR_FACILITEITEN_MAP,
    rmw: IVRMW_FACILITEITEN_MAP,
  },
};
/** @type {MunicipalitySpec} */
const DEFAULT_MUNICIPALITY_SPEC = { gemeenteraad: IVGR_MAP, rmw: IVRMW_MAP };
