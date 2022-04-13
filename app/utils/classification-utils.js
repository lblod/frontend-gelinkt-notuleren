const BURGEMEESTER =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4955bd72cd0e4eb895fdbfab08da0284';
const COLLEGE_VAN_BURGEMEESTER_EN_SCHEPENEN =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000006';
const VOORZITTER_VAN_DE_RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/e14fe683-e061-44a2-b7c8-e10cab4e6ed9';
const GEMEENTERAAD =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005';
const RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000007';
const VOORZITTER_VAN_DE_GEMEENTERAAD =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4c38734d-2cc1-4d33-b792-0bd493ae9fc2';
const BIJZONDER_COMITE_VOOR_DE_SOCIALE_DIENST =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000009';
const DEPUTATIE =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000d';
const GOUVERNEUR =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/180a2fba-6ca9-4766-9b94-82006bb9c709';
const PROVINCIERAAD =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000c';
const VOORZITTER_VAN_HET_BIJZONDER_COMITE_VOOR_DE_SOCIALE_DIENST =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/53c0d8cd-f3a2-411d-bece-4bd83ae2bbc9';
const VAST_BUREAU =
  'http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000008';

export const articlesBasedOnClassifcationMap = {
  [BURGEMEESTER]: 'meetingForm.meetingHeadingArticleGendered',
  [COLLEGE_VAN_BURGEMEESTER_EN_SCHEPENEN]:
    'meetingForm.meetingHeadingArticleUngendered',
  [VOORZITTER_VAN_DE_RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN]:
    'meetingForm.meetingHeadingArticleGendered',
  [GEMEENTERAAD]: 'meetingForm.meetingHeadingArticleGendered',
  [RAAD_VOOR_MAATSCHAPPELIJK_WELZIJN]:
    'meetingForm.meetingHeadingArticleGendered',
  [VOORZITTER_VAN_DE_GEMEENTERAAD]: 'meetingForm.meetingHeadingArticleGendered',
  [BIJZONDER_COMITE_VOOR_DE_SOCIALE_DIENST]:
    'meetingForm.meetingHeadingArticleUngendered',
  [DEPUTATIE]: 'meetingForm.meetingHeadingArticleGendered',
  [GOUVERNEUR]: 'meetingForm.meetingHeadingArticleGendered',
  [PROVINCIERAAD]: 'meetingForm.meetingHeadingArticleGendered',
  [VOORZITTER_VAN_HET_BIJZONDER_COMITE_VOOR_DE_SOCIALE_DIENST]:
    'meetingForm.meetingHeadingArticleGendered',
  [VAST_BUREAU]: 'meetingForm.meetingHeadingArticleUngendered',
};
