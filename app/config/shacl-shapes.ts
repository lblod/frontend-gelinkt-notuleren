export const CITERRA_SHACL_SHAPE = `
  @prefix dbo: <http://dbpedia.org/ontology/> .
  @prefix dc: <http://purl.org/dc/terms/> .
  @prefix foaf: <http://xmlns.com/foaf/0.1/> .
  @prefix rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#> .
  @prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .
  @prefix schemas: <https://schema.org/> .
  @prefix shacl: <http://www.w3.org/ns/shacl#> .
  @prefix skos: <http://www.w3.org/2004/02/skos/core#> .
  @prefix xsd: <http://www.w3.org/2001/XMLSchema#> .
  @prefix ext:	<http://mu.semte.ch/vocabularies/ext/> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#ZoneShape> a shacl:NodeShape;
    shacl:closed false;
    shacl:property <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#ZoneShape/06750a3b20c69a1d055cfd0af2c2b5d6bf989bd2>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#ZoneShape/e9d8e42e8041e72c4534134d5a9044b03bed7ec5>;
    shacl:targetClass <https://data.vlaanderen.be/ns/mobiliteit#Zone> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#ZoneShape/06750a3b20c69a1d055cfd0af2c2b5d6bf989bd2> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Zone.geometrie";
    shacl:description "Ruimtelijke voorstelling van de Zone."@nl;
    shacl:maxCount 1;
    shacl:minCount 1;
     shacl:resultMessage "De zone moet een ruimtelijke voorstelling hebben";
    ext:successMessage "De zone heeft een ruimtelijke voorstelling";
    shacl:name "geometrie"@nl;
    shacl:path <http://www.w3.org/ns/locn#geometry> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#ZoneShape/e9d8e42e8041e72c4534134d5a9044b03bed7ec5> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Zone.naam";
    shacl:description "Naam van de Zone."@nl;
    shacl:minCount 1;
    shacl:maxCount 1;
    shacl:name "naam"@nl;
    shacl:resultMessage "De zone moet een label hebben";
    ext:successMessage "De zone heeft een label";
    shacl:path rdfs:label .


  ### Public Service

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape> a shacl:NodeShape;
    shacl:closed false;
    shacl:property <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/f3050cd43354e672b971fdf4a69154a9bfa03a4a>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/23779a18a5c2f44c8b0dab3a46507d75ba9170f7>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/5bfc49675eef06366e6309009f937f9d904ac377>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/d85ada83fe1a0861efd71a691b59b7b479524d74>;
    shacl:targetClass <http://purl.org/vocab/cpsv#PublicService> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/23779a18a5c2f44c8b0dab3a46507d75ba9170f7> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Publiekedienstverlening.heeftvoorwaarde";
    shacl:description "Voorwaarden aan voldaan moet worden om gebruik te maken van de Publieke Dienstverlening."@nl;
    shacl:name "heeft voorwaarde"@nl;
    shacl:resultMessage "De Publieke Dienstverlening heeft geen woorwaarde gekoppeld";
    ext:successMessage "De Publieke Dienstverlening is correct gekoppeld aan een woorwaarde";
    shacl:path <http://vocab.belgif.be/ns/publicservice#hasRequirement> .


  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/5bfc49675eef06366e6309009f937f9d904ac377> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Publiekedienstverlening.produceert";
    shacl:class <http://data.vlaanderen.be/ns/besluit#Vergunning>,
      <https://data.vlaanderen.be/ns/mobiliteit-intelligente-toegang#Toegang>;
    shacl:description "Vergunning dat verkregen wordt als resultaat van de uitvoering van de Publieke Dienstverlening."@nl,
      "Recht op toegang dat verkregen wordt als resultaat van de uitvoering van de Publieke Dienstverlening."@nl;
    shacl:resultMessage "Please change this message don't know enough about the model";
    ext:successMessage "Please change this message don't know enough about the model";
    shacl:name "produceert"@nl;
    shacl:path <http://purl.org/vocab/cpsv#produces> .


  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/d85ada83fe1a0861efd71a691b59b7b479524d74> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Publiekedienstverlening.volgt";
    shacl:class <https://data.vlaanderen.be/ns/omgevingsvergunning#Procedure>;
    shacl:description "Procedure die de Publieke Dienstverlening volgt."@nl;
    shacl:name "volgt"@nl;
    shacl:resultMessage "De Publieke Dienstverlening heeft geen procedure gekoppeld";
    ext:successMessage "De Publieke Dienstverlening is correct gekoppeld aan een procedure";
    shacl:path <http://purl.org/vocab/cpsv#follows> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#PubliekeDienstverleningShape/f3050cd43354e672b971fdf4a69154a9bfa03a4a> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Publiekedienstverlening.heeftoutputtype";
    shacl:description "De types die de Output van de Publieke Dienstverlening heeft. "@nl;
    shacl:name "heeft outputtype"@nl;
    shacl:resultMessage "Please change this message don't know enough about the model";
    ext:successMessage "Please change this message don't know enough about the model";
    shacl:path <https://data.vlaanderen.be/ns/mobiliteit-intelligente-toegang#heeftOutputtype> .



  ### Requirement

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape> a shacl:NodeShape;
    shacl:closed false;
    shacl:property <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/0e9a7d4dbf6ec19568d474169ad717f71e882319>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/f8b3af2bcda47f912651c708834ece4ee96f4527>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/89c5f32c3193aad42bb0968537063a1363bc30ee>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/f7451c5bb3419860d9a0527686f0bd5efdad4491>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/236f0210baaf149903750c43bbe7012c21debb2a>;
    shacl:targetClass <http://data.europa.eu/m8g/Requirement> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/0e9a7d4dbf6ec19568d474169ad717f71e882319> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaarde.beschrijving";
    shacl:datatype rdf:langString;
    shacl:maxCount 1;
    shacl:minCount 1;
    shacl:description "Korte uitleg over de aard, kenmerken, toepassingen of andere aanvullende informatie die helpt bij het verduidelijken van de Voorwaarde."@nl;
    shacl:resultMessage "De woorwaarde heeft geen beschrijving";
    ext:successMessage "De woorwaarde hebben een juist beschrijving";
    shacl:name "beschrijving"@nl;
    shacl:path dc:description .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/236f0210baaf149903750c43bbe7012c21debb2a> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaarde.type";
    shacl:description "Classificering van de Voorwaarde aan de hand van een gecontroleerde codelijst."@nl;
    shacl:maxCount 1;
    shacl:minCount 1;
    shacl:name "type"@nl;
    shacl:resultMessage "De woorwaarde heeft geen type";
    ext:successMessage "De woorwaarde hebben een juist type";
    shacl:path dc:type .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/89c5f32c3193aad42bb0968537063a1363bc30ee> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaarde.heeftondersteunendbewijs";
    shacl:class <http://data.europa.eu/m8g/Evidence>;
    shacl:description "Bewijs dat informatie/ondersteuning biedt voor de Voorwaarde."@nl;
    shacl:name "heeft ondersteunend bewijs"@nl;
    shacl:resultMessage "Woorwaarde is niet correct gekoppeld aan het bewijs";
    ext:successMessage "Geen problemen met het verband tussen de woorwaarden en het bewijs";
    shacl:path <http://data.europa.eu/m8g/hasSupportingEvidence> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/f7451c5bb3419860d9a0527686f0bd5efdad4491> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaarde.isvoorwaardevan";
    shacl:class <https://data.vlaanderen.be/ns/mobiliteit-intelligente-toegang#Voorwaardecollectie>;
    shacl:description "Supervoorwaarde van de Voorwaarde."@nl;
    shacl:name "is voorwaarde van"@nl;
    shacl:resultMessage "Requirement is niet correct gekoppeld aan de collectie";
    ext:successMessage "Geen problemen met de koppeling van woorwaarden aan de collectie";
    shacl:path <http://data.europa.eu/m8g/isRequirementOf> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeShape/f8b3af2bcda47f912651c708834ece4ee96f4527> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaarde.heeftbewijstypelijst";
    shacl:class <http://data.europa.eu/m8g/EvidenceTypeList>;
    shacl:description "Bewijstypelijst dat specificieert welke Bewijstypes nodig zijn om aan de Voorwaarde te voldoen."@nl;
    shacl:name "heeft bewijstypelijst"@nl;
    shacl:resultMessage "De voorwaarde moet een bewijstypelijst hebben";
    ext:successMessage "De voorwaarde heeft een bewijstypelijst";
    shacl:path <http://data.europa.eu/m8g/hasEvidenceTypeList> .



  ### Requirement collection

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeCollectieShape> a shacl:NodeShape;
    shacl:closed false;
    shacl:property <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeCollectieShape/23779a18a5c2f44c8b0dab3a46507d75ba9170f7>,
      <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeCollectieShape/481218c045793f428f6d7d5507279a4fefc8910a>;
    shacl:targetClass <https://data.vlaanderen.be/ns/mobiliteit-intelligente-toegang#Voorwaardecollectie> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeCollectieShape/23779a18a5c2f44c8b0dab3a46507d75ba9170f7> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaardecollectie.heeftvoorwaarde";
    shacl:description "Subvoorwaarde van de Voorwaarde."@nl;
    shacl:name "heeft voorwaarde"@nl;
    shacl:resultMessage "De voorwaarde collectie moet een subvoorwaarde hebben";
    ext:successMessage "De voorwaarde collectie heeft een subvoorwaarde ";
    shacl:path <http://data.europa.eu/m8g/hasRequirement> .

  <https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#VoorwaardeCollectieShape/481218c045793f428f6d7d5507279a4fefc8910a> rdfs:seeAlso "https://data.vlaanderen.be/doc/applicatieprofiel/mobiliteit-intelligente-toegang/ontwerpstandaard/2024-12-19#Voorwaardecollectie.operatie";
    shacl:description "Logische operatie die toegepast wordt op de Voorwaarden."@nl;
    shacl:name "operatie"@nl;
    shacl:resultMessage "Please change this message don't know enough about the model";
    ext:successMessage "Please change this message don't know enough about the model";
    shacl:minCount 1;
    shacl:maxCount 1;
    shacl:path <https://data.vlaanderen.be/ns/mobiliteit-intelligente-toegang#operatie> .
`;
