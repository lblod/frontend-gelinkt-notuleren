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
  Retributiereglement:
    'https://data.vlaanderen.be/id/concept/BesluitType/ba5922c9-cfad-4b2e-b203-36479219ba56',
  Personeelsreglement:
    'https://data.vlaanderen.be/id/concept/BesluitType/4673d472-8dbc-4cea-b3ab-f92df3807eb3',
  'Aanvullend reglement op het wegverkeer m.b.t. gemeentewegen in speciale beschermingszones':
    'https://data.vlaanderen.be/id/concept/BesluitType/4673d472-8dbc-4cea-b3ab-f92df3807eb3',
  Gebruikersreglement:
    'https://data.vlaanderen.be/id/concept/BesluitType/fb92601a-d189-4482-9922-ab0efc6bc935',
  Belastingreglement:
    'https://data.vlaanderen.be/id/concept/BesluitType/efa4ec5a-b006-453f-985f-f986ebae11bc',
  Contantbelasting:
    'https://data.vlaanderen.be/id/concept/BesluitType/4c22ef0a-f808-41dd-9c9f-2aff17fd851f',
  'Aanvullende belasting of opcentiem':
    'https://data.vlaanderen.be/id/concept/BesluitType/b2d0734d-13d0-44b4-9af8-1722933c5288',
  Kohierbelasting:
    'https://data.vlaanderen.be/id/concept/BesluitType/8597e056-b96d-4213-ad4c-37338f2aaf35',
  'Huishoudelijk reglement':
    'https://data.vlaanderen.be/id/concept/BesluitType/a8486fa3-6375-494d-aa48-e34289b87d5b',
  'Deontologische Code':
    'https://data.vlaanderen.be/id/concept/BesluitType/25deb453-ae3e-4d40-8027-36cdb48ab738',
  'Reglement Onderwijs':
    'https://data.vlaanderen.be/id/concept/BesluitType/e8aee49e-8762-4db2-acfe-2d5dd3c37619',
  'Subsidie, premie, erkenning':
    'https://data.vlaanderen.be/id/concept/BesluitType/d7060f97-c417-474c-abc6-ef006cb61f41',
  'Tijdelijke politieverordening (op het wegverkeer)':
    'https://data.vlaanderen.be/id/concept/BesluitType/256bd04a-b74b-4f2a-8f5d-14dda4765af9',
  'Aanvullend reglement op het wegverkeer m.b.t. gemeentewegen in havengebied':
    'https://data.vlaanderen.be/id/concept/BesluitType/3bba9f10-faff-49a6-acaa-85af7f2199a3',
  Politiereglement:
    'https://data.vlaanderen.be/id/concept/BesluitType/e8afe7c5-9640-4db8-8f74-3f023bec3241',
  'Aanvullend reglement op het wegverkeer enkel m.b.t. gemeentewegen (niet in havengebied of speciale beschermingszones)':
    'https://data.vlaanderen.be/id/concept/BesluitType/4d8f678a-6fa4-4d5f-a2a1-80974e43bf34',
  Delegatiereglement:
    'https://data.vlaanderen.be/id/concept/BesluitType/5ee63f84-2fa0-4758-8820-99dca2bdce7c',
  Andere:
    'https://data.vlaanderen.be/id/concept/BesluitType/84121221-4217-40e3-ada2-cd1379b168e1',
  'Aanvullend reglement op het wegverkeer m.b.t. één of meerdere gewestwegen':
    'https://data.vlaanderen.be/id/concept/BesluitType/7d95fd2e-3cc9-4a4c-a58e-0fbc408c2f9b',
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
  BESLUIT_TYPES['Retributiereglement'],
  BESLUIT_TYPES['Personeelsreglement'],
  BESLUIT_TYPES[
    'Aanvullend reglement op het wegverkeer m.b.t. gemeentewegen in speciale beschermingszones'
  ],
  BESLUIT_TYPES['Gebruikersreglement'],
  BESLUIT_TYPES['Belastingreglement'],
  BESLUIT_TYPES['Contantbelasting'],
  BESLUIT_TYPES['Aanvullende belasting of opcentiem'],
  BESLUIT_TYPES['Kohierbelasting'],
  BESLUIT_TYPES['Huishoudelijk reglement'],
  BESLUIT_TYPES['Deontologische Code'],
  BESLUIT_TYPES['Reglement Onderwijs'],
  BESLUIT_TYPES['Subsidie, premie, erkenning'],
  BESLUIT_TYPES['Tijdelijke politieverordening (op het wegverkeer)'],
  BESLUIT_TYPES[
    'Aanvullend reglement op het wegverkeer m.b.t. gemeentewegen in havengebied'
  ],
  BESLUIT_TYPES['Politiereglement'],
  BESLUIT_TYPES[
    'Aanvullend reglement op het wegverkeer enkel m.b.t. gemeentewegen (niet in havengebied of speciale beschermingszones)'
  ],
  BESLUIT_TYPES['Delegatiereglement'],
  BESLUIT_TYPES['Andere'],
  BESLUIT_TYPES[
    'Aanvullend reglement op het wegverkeer m.b.t. één of meerdere gewestwegen'
  ],
];

export default BESLUIT_TYPES;
