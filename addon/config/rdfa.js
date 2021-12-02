const prefixableRdfaKeywords = [
  'typeof',
  'property',
  'src',
  'rel',
  'href',
  'resource',
  'about',
  'datatype'
];

const rdfaKeywords = prefixableRdfaKeywords.concat([
  'vocab',
  'prefix',
  'content'
]);

const defaultPrefixes = {
  as:	"https://www.w3.org/ns/activitystreams#",
  csvw:	"http://www.w3.org/ns/csvw#",
  dcat:	"http://www.w3.org/ns/dcat#",
  dqv: "http://www.w3.org/ns/dqv#",
  duv: "https://www.w3.org/TR/vocab-duv#",
  grddl: "http://www.w3.org/2003/g/data-view#",
  ldp: "http://www.w3.org/ns/ldp#",
  ma:	"http://www.w3.org/ns/ma-ont#",
  oa:	"http://www.w3.org/ns/oa#",
  org: "http://www.w3.org/ns/org#",
  owl: "http://www.w3.org/2002/07/owl#",
  prov:	"http://www.w3.org/ns/prov#",
  qb: "http://purl.org/linked-data/cube#",
  rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
  rdfa: "http://www.w3.org/ns/rdfa#",
  rdfs: "http://www.w3.org/2000/01/rdf-schema#",
  rif: "http://www.w3.org/2007/rif#",
  rr: "http://www.w3.org/ns/r2rml#",
  sd: "http://www.w3.org/ns/sparql-service-description#",
  skos:	"http://www.w3.org/2004/02/skos/core#",
  skosxl:	"http://www.w3.org/2008/05/skos-xl#",
  ssn: "http://www.w3.org/ns/ssn/",
  sosa:	"http://www.w3.org/ns/sosa/",
  time:	"http://www.w3.org/2006/time#",
  void:	"http://rdfs.org/ns/void#",
  wdr: "http://www.w3.org/2007/05/powder#",
  wdrs:	"http://www.w3.org/2007/05/powder-s#",
  xhv: "http://www.w3.org/1999/xhtml/vocab#",
  xml: "http://www.w3.org/XML/1998/namespace",
  xsd: "http://www.w3.org/2001/XMLSchema#",
  cc:	"http://creativecommons.org/ns#",
  ctag:	"http://commontag.org/ns#",
  dc:	"http://purl.org/dc/terms/",
  dct:	"http://purl.org/dc/terms/",
  dcterms:	"http://purl.org/dc/terms/",
  dc11:	"http://purl.org/dc/elements/1.1/",
  foaf:	"http://xmlns.com/foaf/0.1/",
  gr:	"http://purl.org/goodrelations/v1#",
  ical:	"http://www.w3.org/2002/12/cal/icaltzd#",
  og:	"http://ogp.me/ns#",
  rev:	"http://purl.org/stuff/rev#",
  sioc:	"http://rdfs.org/sioc/ns#",
  v:	"http://rdf.data-vocabulary.org/#",
  vcard:	"http://www.w3.org/2006/vcard/ns#",
  schema:	"http://schema.org/",
  ext: "http://mu.semte.ch/vocabularies/ext/"
};

export { rdfaKeywords, prefixableRdfaKeywords, defaultPrefixes };
