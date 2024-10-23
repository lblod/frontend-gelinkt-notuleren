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
  BURGEMEESTER:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011',
  VOORZITTER_GEMEENTERAAD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000012',
  LID_BCSD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000019',
  VOORZITTER_BCSD:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e00001a',
  LID_RAAD_MAATSCHAPPELIJK_WELZIJN:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011',
  VOORZITTER_RAAD_MAATSCHAPPELIJK_WELZIJN:
    'http://data.vlaanderen.be/id/concept/BestuursfunctieCode/5ab0e9b8a3b2ca7c5e000011',
};

export const BESTUURSPERIODES = {
  '2012-2019':
    'http://data.lblod.info/id/concept/Bestuursperiode/845dbc7f-139e-4632-b200-f90e180f1dba',
  '2019-2024':
    'http://data.lblod.info/id/concept/Bestuursperiode/a2b977a3-ce68-4e42-80a6-4397f66fc5ca',
  '2024-heden':
    'http://data.lblod.info/id/concept/Bestuursperiode/96efb929-5d83-48fa-bfbb-b98dfb1180c7',
};

export const LOKALE_VERKIEZINGEN = {
  2024: 'http://data.lblod.info/id/rechtstreekse-verkiezingen/612a57de-7fc2-40af-a7dc-17d544e5de20',
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
