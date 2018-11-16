const defaultContext = {
  vocab: 'http://data.vlaanderen.be/ns/besluit#',
  prefix: {
    eli: 'http://data.europa.eu/eli/ontology#',
    prov: 'http://www.w3.org/ns/prov#',
    mandaat: 'http://data.vlaanderen.be/ns/mandaat#',
    besluit: 'http://data.vlaanderen.be/ns/besluit#',
    ext: 'http://mu.semte.ch/vocabularies/ext/',
    person: 'http://www.w3.org/ns/person#',
    persoon: 'http://data.vlaanderen.be/ns/persoon#',
    foaf: 'http://xmlns.com/foaf/0.1/familyName/'
  }
};

export default JSON.stringify(defaultContext);
