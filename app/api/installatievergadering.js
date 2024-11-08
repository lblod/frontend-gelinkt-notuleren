/**
 * @typedef {import('../models/installatievergadering').default} InstallatieVergaderingModel
 * @typedef {import('../models/bestuursorgaan').default} BestuursorgaanModel
 * @typedef {import('../services/template-fetcher').default} TemplateFetcher
 */

import { RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN } from '../utils/classification-utils';
import templateUuidInstantiator from '@lblod/template-uuid-instantiator';

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
const IVGR_FUSIE_MAP = [
  {
    templateTitle:
      'IVGRFusie1 Kennisname van de definitieve verkiezingsuitslag DUMMY',
    apTitle: 'Kennisname van de definitieve verkiezingsuitslag fusie',
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
/** @type {TemplateSpec[]} */
const IVRMW_FUSIE_MAP = IVRMW_MAP;

/**
 * @typedef {Object} MunicipalitySpec
 * @property {TemplateSpec[]} gemeenteraad
 * @property {TemplateSpec[]} rmw
 */

const FUSION_SPEC = { gemeenteraad: IVGR_FUSIE_MAP, rmw: IVRMW_FUSIE_MAP };

/**
 * municipalities without the 9th agenda item about the police zone
 * @type {MunicipalitySpec}
 */
const NO_POLITIERAAD_SPEC = {
  gemeenteraad: IVGR_MAP,
  rmw: IVRMW_MAP,
};

/**
 * Most municipalities will have the 9th agenda item
 * @type {MunicipalitySpec} */
const DEFAULT_MUNICIPALITY_SPEC = {
  gemeenteraad: IVGR_POLITIERAAD_MAP,
  rmw: IVRMW_MAP,
};
// we will not provide special templates for border municipalities
const FACILITY_SPEC = DEFAULT_MUNICIPALITY_SPEC;

/** @type { Record<string, MunicipalitySpec> } */
const MUNICIPALITY_CONFIG = {
  // We won't have special templates for voeren
  Voeren: { gemeenteraad: NO_POLITIERAAD_SPEC, rmw: IVRMW_MAP },
  // faciliteitengemeentes (municipalities on the language border which have
  // special facilities for the french-speaking minorities)
  Bever: FACILITY_SPEC,
  Drogenbos: FACILITY_SPEC,
  Herstappe: FACILITY_SPEC,
  Kraainem: FACILITY_SPEC,
  Linkebeek: FACILITY_SPEC,
  Mesen: FACILITY_SPEC,
  Ronse: { gemeenteraad: NO_POLITIERAAD_SPEC, rmw: IVRMW_MAP },
  'Sint-Genesius-Rode': FACILITY_SPEC,
  'Spiere-Helkijn': FACILITY_SPEC,
  Wemmel: FACILITY_SPEC,
  'Wezembeek-Oppem': FACILITY_SPEC,
  // fusions
  'Merelbeke-Melle': FUSION_SPEC,
  'Nazareth-De Pinte': FUSION_SPEC,
  Pajottegem: FUSION_SPEC,
  'Tessenderlo-Ham': FUSION_SPEC,
  Tielt: FUSION_SPEC,
  Lochristi: FUSION_SPEC,
  Hasselt: FUSION_SPEC,
  'Beveren-Kruibeke-Zwijndrecht': FUSION_SPEC,
  Wingene: FUSION_SPEC,
  'Tongeren-Borgloon': FUSION_SPEC,
  'Bilzen-Hoeselt': FUSION_SPEC,
  //TODO: NO Politieraad for lokeren
  Lokeren: FUSION_SPEC,

  // municipalities without the 9th agenda item
  Antwerpen: NO_POLITIERAAD_SPEC,
  Brasschaat: NO_POLITIERAAD_SPEC,
  Schoten: NO_POLITIERAAD_SPEC,
  Lier: NO_POLITIERAAD_SPEC,
  'Heist-op-den-Berg': NO_POLITIERAAD_SPEC,
  Lommel: NO_POLITIERAAD_SPEC,
  'Heusden-Zolder': NO_POLITIERAAD_SPEC,
  Leuven: NO_POLITIERAAD_SPEC,
  Aarschot: NO_POLITIERAAD_SPEC,
  Zaventem: NO_POLITIERAAD_SPEC,
  Dilbeek: NO_POLITIERAAD_SPEC,
  Grimbergen: NO_POLITIERAAD_SPEC,
  Gent: NO_POLITIERAAD_SPEC,
  'Sint-Niklaas': NO_POLITIERAAD_SPEC,
  Aalst: NO_POLITIERAAD_SPEC,
  Ninove: NO_POLITIERAAD_SPEC,
  Dendermonde: NO_POLITIERAAD_SPEC,
  Brugge: NO_POLITIERAAD_SPEC,
  Oostende: NO_POLITIERAAD_SPEC,
  Middelkerke: NO_POLITIERAAD_SPEC,
};
