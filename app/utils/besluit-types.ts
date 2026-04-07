const BESLUIT_TYPES = {
  'Reglementen en verordeningen':
    'https://data.vlaanderen.be/id/concept/BesluitType/67378dd0-5413-474b-8996-d992ef81637a',
  'Rechtspositieregeling (RPR)':
    'https://data.vlaanderen.be/id/concept/BesluitType/fb21d14b-734b-48f4-bd4e-888163fd08e8',
  'Meerjarenplan(aanpassing)':
    'https://data.vlaanderen.be/id/concept/BesluitType/f56c645d-b8e1-4066-813d-e213f5bc529f',
  'Jaarrekening PEVA':
    'https://data.vlaanderen.be/id/concept/BesluitType/0a8141bc-cf35-43dd-855d-365fa32ad89b',
  'Oprichting autonoom bedrijf':
    'https://data.vlaanderen.be/id/concept/BesluitType/bd0b0c42-ba5e-4acc-b644-95f6aad904c7',
  'Oprichting of deelname EVA':
    'https://data.vlaanderen.be/id/concept/BesluitType/f8c070bd-96e4-43a1-8c6e-532bcd771251',
  'Oprichting IGS':
    'https://data.vlaanderen.be/id/concept/BesluitType/1105564e-30c7-4371-a864-6b7329cdae6f',
  'Oprichting districtsbestuur':
    'https://data.vlaanderen.be/id/concept/BesluitType/380674ee-0894-4c41-bcc1-9deaeb9d464c',
};

export const DECISION_TYPES_TO_LINK = [
  BESLUIT_TYPES['Reglementen en verordeningen'],
  BESLUIT_TYPES['Rechtspositieregeling (RPR)'],
  BESLUIT_TYPES['Meerjarenplan(aanpassing)'],
  BESLUIT_TYPES['Jaarrekening PEVA'],
  BESLUIT_TYPES['Oprichting autonoom bedrijf'],
  BESLUIT_TYPES['Oprichting of deelname EVA'],
  BESLUIT_TYPES['Oprichting IGS'],
  BESLUIT_TYPES['Oprichting districtsbestuur'],
];

export default BESLUIT_TYPES;
