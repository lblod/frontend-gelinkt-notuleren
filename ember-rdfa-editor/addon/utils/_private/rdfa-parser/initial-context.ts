/**
 * Modified from https://github.com/rubensworks/rdfa-streaming-parser.js
 *
 * Copyright © 2019 Ruben Taelman
 */

const INITIAL_CONTEXT = {
  '@context': {
    as: 'https://www.w3.org/ns/activitystreams#',
    cat: 'http://www.w3.org/ns/dcat#',
    cc: 'http://creativecommons.org/ns#',
    cnt: 'http://www.w3.org/2008/content#',
    csvw: 'http://www.w3.org/ns/csvw#',
    ctag: 'http://commontag.org/ns#',
    dc: 'http://purl.org/dc/terms/',
    dc11: 'http://purl.org/dc/elements/1.1/',
    dcat: 'http://www.w3.org/ns/dcat#',
    dcterms: 'http://purl.org/dc/terms/',
    dqv: 'http://www.w3.org/ns/dqv#',
    duv: 'https://www.w3.org/TR/vocab-duv#',
    earl: 'http://www.w3.org/ns/earl#',
    foaf: 'http://xmlns.com/foaf/0.1/',
    gldp: 'http://www.w3.org/ns/people#',
    gr: 'http://purl.org/goodrelations/v1#',
    grddl: 'http://www.w3.org/2003/g/data-view#',
    ht: 'http://www.w3.org/2006/http#',
    ical: 'http://www.w3.org/2002/12/cal/icaltzd#',
    ldp: 'http://www.w3.org/ns/ldp#',
    ma: 'http://www.w3.org/ns/ma-ont#',
    oa: 'http://www.w3.org/ns/oa#',
    odrl: 'http://www.w3.org/ns/odrl/2/',
    og: 'http://ogp.me/ns#',
    org: 'http://www.w3.org/ns/org#',
    owl: 'http://www.w3.org/2002/07/owl#',
    prov: 'http://www.w3.org/ns/prov#',
    ptr: 'http://www.w3.org/2009/pointers#',
    qb: 'http://purl.org/linked-data/cube#',
    rev: 'http://purl.org/stuff/rev#',
    rdf: 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
    rdfa: 'http://www.w3.org/ns/rdfa#',
    rdfs: 'http://www.w3.org/2000/01/rdf-schema#',
    rif: 'http://www.w3.org/2007/rif#',
    rr: 'http://www.w3.org/ns/r2rml#',
    schema: 'http://schema.org/',
    sd: 'http://www.w3.org/ns/sparql-service-description#',
    sioc: 'http://rdfs.org/sioc/ns#',
    skos: 'http://www.w3.org/2004/02/skos/core#',
    skosxl: 'http://www.w3.org/2008/05/skos-xl#',
    ssn: 'http://www.w3.org/ns/ssn/',
    sosa: 'http://www.w3.org/ns/sosa/',
    time: 'http://www.w3.org/2006/time#',
    v: 'http://rdf.data-vocabulary.org/#',
    vcard: 'http://www.w3.org/2006/vcard/ns#',
    void: 'http://rdfs.org/ns/void#',
    wdr: 'http://www.w3.org/2007/05/powder#',
    wdrs: 'http://www.w3.org/2007/05/powder-s#',
    xhv: 'http://www.w3.org/1999/xhtml/vocab#',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xsd: 'http://www.w3.org/2001/XMLSchema#',
    describedby: 'http://www.w3.org/2007/05/powder-s#describedby',
    license: 'http://www.w3.org/1999/xhtml/vocab#license',
    role: 'http://www.w3.org/1999/xhtml/vocab#role',
  },
};
export default INITIAL_CONTEXT;
