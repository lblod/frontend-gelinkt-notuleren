export interface Context {
  vocab: string;
  typeof?: string;
  prefix: Record<string, string>;
}

const defaultContext: Context = {
  vocab: 'http://data.vlaanderen.be/ns/besluit#',
  prefix: {
    eli: 'http://data.europa.eu/eli/ontology#',
    prov: 'http://www.w3.org/ns/prov#',
    mandaat: 'http://data.vlaanderen.be/ns/mandaat#',
    besluit: 'http://data.vlaanderen.be/ns/besluit#',
    dossier: 'https://data.vlaanderen.be/ns/dossier',
    ext: 'http://mu.semte.ch/vocabularies/ext/',
    person: 'http://www.w3.org/ns/person#',
    persoon: 'http://data.vlaanderen.be/ns/persoon#',
    dateplugin: 'http://say.data.gift/manipulators/insertion/',
    besluittype: 'https://data.vlaanderen.be/id/concept/BesluitType/',
    besluitpublicatie:
      'https://data.vlaanderen.be/doc/applicatieprofiel/besluit-publicatie#',
    dct: 'http://purl.org/dc/terms/',
    mobiliteit: 'https://data.vlaanderen.be/ns/mobiliteit#',
    lblodgn: 'http://data.lblod.info/vocabularies/gelinktnotuleren/',
    lblodmow: 'http://data.lblod.info/vocabularies/mobiliteit/',
    say: 'https://say.data.gift/ns/',
  },
};

export default JSON.stringify(defaultContext);
