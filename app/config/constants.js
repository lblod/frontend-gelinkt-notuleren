export const EDITOR_FOLDERS = {
  IRG_ARCHIVE: '17b39ab5-9da6-42fd-8568-2b1a848cd21c',
  DECISION_DRAFTS: 'ae5feaed-7b70-4533-9417-10fbbc480a4c',
  REGULATORY_STATEMENTS: 'd80d06d2-8fc2-4b12-821f-e88b2f035a44',
  TRASH: '5A8304E8C093B00009000010',
};

export const PLUGIN_CONFIGS = {
  TABLE_OF_CONTENTS: [
    {
      nodeHierarchy: [
        'title|chapter|section|subsection|article',
        'structure_header|article_header',
      ],
    },
  ],
  date: (intl) => {
    return {
      formats: [
        {
          label: intl.t('date-format.short-date'),
          key: 'short',
          dateFormat: 'dd/MM/yy',
          dateTimeFormat: 'dd/MM/yy HH:mm',
        },
        {
          label: intl.t('date-format.long-date'),
          key: 'long',
          dateFormat: 'EEEE dd MMMM yyyy',
          dateTimeFormat: 'PPPPp',
        },
      ],
      allowCustomFormat: true,
    };
  },
};

export const BESTUURSFUNCTIE_CODES = {
  GEMEENTERAADSLID:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011',
  SCHEPEN:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000014',
  TOEGEVOEGDE_SCHEPEN:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/59a90e03-4f22-4bb9-8c91-132618db4b38',
  BURGEMEESTER:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011',
  VOORZITTER_GEMEENTERAAD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000012',
  LID_BCSD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000019',
  VOORZITTER_BCSD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e00001a',
  LID_RAAD_MAATSCHAPPELIJK_WELZIJN:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000015',
  VOORZITTER_RAAD_MAATSCHAPPELIJK_WELZIJN:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000016',
  LID_DISTRICTSRAAD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e00001b',
  VOORZITTER_DISTRICTSRAAD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e00001c',
};

export const BESTUURSPERIODES = {
  '2012-2019':
    'http://data.lblod.info/id/concept/Bestuursperiode/845dbc7f-139e-4632-b200-f90e180f1dba',
  '2019-2024':
    'http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca',
  '2024-heden':
    'http://data.lblod.info/id/concept/Bestuursperiode/96efb929-5d83-48fa-bfbb-b98dfb1180c7',
};

export const MANDATARIS_STATUS_CODES = {
  EFFECTIEF:
    'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/21063a5b-912c-4241-841c-cc7fb3c73e75',
  TITELVOEREND:
    'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/aacb3fed-b51d-4e0b-a411-f3fa641da1b3',
  VERHINDERD:
    'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/c301248f-0199-45ca-b3e5-4c596731d5fe',
  WAARNEMEND:
    'http://data.vlaanderen.be/id/concept/MandatarisStatusCode/e1ca6edd-55e1-4288-92a5-53f4cf71946a',
};

export const BESTUURSEENHEID_CLASSIFICATIE_CODES = {
  GEMEENTE:
    'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000001',
  PROVINCIE:
    'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000000',
  OCMW: 'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000002',
  DISTRICT:
    'http://data.vlaanderen.be/id/concept/BestuurseenheidClassificatieCode/5ab0e9b8a3b2ca7c5e000003',
};

export const BESTUURSORGAAN_CLASSIFICATIE_CODES = {
  GEMEENTERAAD:
    'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005',
  PROVINCIERAAD:
    'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000c',
  DISTRICTSRAAD:
    'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000a',
  OCMW_RAAD:
    'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000007',
  COLLEGE_VAN_BURGEMEESTER_EN_SCHEPENEN:
    'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000006',
  VOORZITTER_BSCD:
    'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/53c0d8cd-f3a2-411d-bece-4bd83ae2bbc9',
  BCSD: 'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000009',
};

export const IV_CLASSIFICATIE_MAP = {
  [BESTUURSEENHEID_CLASSIFICATIE_CODES.GEMEENTE]:
    BESTUURSORGAAN_CLASSIFICATIE_CODES.GEMEENTERAAD,
  [BESTUURSEENHEID_CLASSIFICATIE_CODES.PROVINCIE]:
    BESTUURSORGAAN_CLASSIFICATIE_CODES.PROVINCIERAAD,
  [BESTUURSEENHEID_CLASSIFICATIE_CODES.DISTRICT]:
    BESTUURSORGAAN_CLASSIFICATIE_CODES.DISTRICTSRAAD,
  [BESTUURSEENHEID_CLASSIFICATIE_CODES.OCMW]:
    BESTUURSORGAAN_CLASSIFICATIE_CODES.OCMW_RAAD,
};

export const ADMINISTRATIVE_UNIT_URIS = {
  GEMEENTE_GENT:
    'http://data.lblod.info/id/bestuurseenheden/353234a365664e581db5c2f7cc07add2534b47b8e1ab87c821fc6e6365e6bef5',
  OCMW_GENT:
    'http://data.lblod.info/id/bestuurseenheden/c5623baf3970c5efa9746dff01afd43092c1321a47316dbe81ed79604b56e8ea',
};

export const CONCEPT_SCHEMES = {
  USER_PREFERENCES:
    'http://lblod.data.gift/concept-schemes/f9bd0f31-8932-4a04-8c79-f92066c991f3',
};

// From https://github.com/Informatievlaanderen/OSLOthema-lokaleBesluiten/blob/feature%2Fbestaande-signalisatie/codelijsten%2Fverkeersbordontwerpstatus.ttl
export const TRAFFIC_SIGNAL_DESIGN_STATUSES = {
  IN_VOORONTWERP:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/13fc4b70-2d88-4d11-a512-b36bce2d0fbf',
  VERWIJDERING_GEWEIGERD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/1a902ca6-4611-46a8-be8a-13e997820ce0',
  BESTAAND_GEWEIGERD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/1b20f33b-c04a-4e3b-b608-9991c3142d65',
  BESTAAND_IN_VOORONTWERP:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/1c6b6dae-8ffc-4a1b-97a9-b6f2cd943cf8',
  VERWIJDERING_UITGEVOERD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/2826e311-ce64-417c-be93-29a2516e81e1',
  ONTWERP_TER_GOEDKEURING:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/3447a138-87d6-4745-b081-2faf02aed3f1',
  GOEDGEKEURD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/3e869c24-2777-4e95-87a3-f97cd2f7289a',
  BESTAAND_AFGESLOTEN:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/3f4fc0f2-d039-491c-9cdf-a1db31860d05',
  IN_ONTWERP:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/467e89ae-0cfc-4a91-b29f-82c3cfc2bc6a',
  GEWEIGERD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/49e1818b-af6d-438c-9d90-886d8eb372fb',
  BESTAAND_UITGEVOERD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/4ed63f9b-f195-46f0-8d17-d3c682e771f6',
  BESTAAND_TER_GOEDKEURING:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/56bf79cd-0b9d-4658-a394-5e56077729b0',
  VERWIJDERING_TER_GOEDKEURING:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/5eb131f1-06f6-473d-b18a-9ab6b4470810',
  AFGESLOTEN:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/64e54352-de4e-4a5b-9322-79c5f8010620',
  BESTAAND_GOEDGEKEURD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/7bf5dad3-244a-4cc3-9a2b-b96ac656f4b6',
  VERWIJDERING_IN_ONTWERP:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/9b0b6915-1ad5-4eff-90f0-0486a3562493',
  VERWIJDERING_IN_VOORONTWERP:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/b42c1cf8-0cb4-4faa-a740-f073a3ed3a0c',
  VERWIJDERING_AFGESLOTEN:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/c6bcbe00-54b8-45cd-a52a-29228db371dd',
  VERWIJDERING_GOEDGEKEURD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/ca7a6ea2-3a07-4de3-87d5-0f9295fbf0bd',
  BESTAAND_IN_ONTWERP:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/e3b880ac-8186-4c0f-9ab3-439cab4ec130',
  UITGEVOERD:
    'https://data.vlaanderen.be/id/concept/Verkeerstekenontwerpstatus/fc1036e7-703b-4290-b732-49abb39d0588',
};

export const TRAFFIC_SIGNAL_EXISTING_STATUSES = [
  TRAFFIC_SIGNAL_DESIGN_STATUSES.BESTAAND_UITGEVOERD,
  TRAFFIC_SIGNAL_DESIGN_STATUSES.VERWIJDERING_UITGEVOERD,
  TRAFFIC_SIGNAL_DESIGN_STATUSES.UITGEVOERD,
];
