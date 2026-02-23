export const decisionShape = `
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix qb:      <http://purl.org/linked-data/cube#> .
@prefix lblodBesluit:	<http://lblod.data.gift/vocabularies/besluit/> .
@prefix ext:	<http://mu.semte.ch/vocabularies/ext/> .
<https://data.vlaanderen.be/shacl/besluit-publicatie#BesluitShape>
	a sh:NodeShape ;
	sh:targetClass <http://data.vlaanderen.be/ns/besluit#Besluit> ;
	sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-description-validation>;
    sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-article-container-validation>;
	sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-short-title-validation>;
    sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-title-validation>;
    sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-article-validation>;
    sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-citation-validation>;
    sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-motivering-validation>;
	sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-publication-date-validation>;
    sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-date-no-longer-in-force-validation>;
	sh:property <https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-first-date-entry-in-force-validation>;
	sh:closed false .

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-description-validation> sh:name "beschrijving" ;
		sh:description "Een beknopte beschrijving van het besluit." ;
		sh:path <http://data.europa.eu/eli/ontology#description> ;
		 sh:or (
      [
        sh:datatype <http://www.w3.org/2001/XMLSchema#string>;
      ]
      [
        sh:datatype <http://www.w3.org/1999/02/22-rdf-syntax-ns#langString>;
      ]
    );
    sh:minCount 1 ;
		sh:maxCount 1 ;
        sh:resultMessage "Het besluit moet exact één beschrijving hebben.";
    	ext:successMessage "Het besluit heeft een beschrijving.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-article-container-validation> sh:name "inhoud" ;
		sh:description "De beschrijving van de beoogde rechtsgevolgen, het zogenaamde beschikkend gedeelte." ;
		sh:path <http://www.w3.org/ns/prov#value> ;
    sh:or (
      [
        sh:datatype <http://www.w3.org/2001/XMLSchema#string>;
      ]
      [
        sh:datatype <http://www.w3.org/1999/02/22-rdf-syntax-ns#langString>;
      ]
    );
		sh:minCount 1 ;
		sh:maxCount 1 ;
        sh:resultMessage "Het besluit moet een artikelcontainer hebben.";
        ext:successMessage "Het besluit heeft een artikelcontainer.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-short-title-validation> sh:name "citeeropschrift" ;
		sh:description "De beknopte titel of officiële korte naam van een decreet, wet, besluit... Deze wordt officieel vastgelegd. Deze benaming wordt in de praktijk gebruikt om naar de rechtsgrond te verwijzen." ;
		sh:path <http://data.europa.eu/eli/ontology#title_short> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#string> ;
        sh:minCount 0 ;
		sh:maxCount 1 ;
        sh:resultMessage "Het besluit mag niet meer dan één officiële titel hebben.";
    	ext:successMessage "Het besluit heeft een officiële titel.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-title-validation> sh:name "titel" ;
		sh:description "Titel van de legale verschijningsvorm." ;
		sh:path <http://data.europa.eu/eli/ontology#title> ;
		sh:or (
      [
        sh:datatype <http://www.w3.org/2001/XMLSchema#string>;
      ]
      [
        sh:datatype <http://www.w3.org/1999/02/22-rdf-syntax-ns#langString>;
      ]
    );
		sh:minCount 1 ;
    sh:maxCount 1 ;
        sh:resultMessage "Het besluit moet minstens één titel hebben.";
        ext:successMessage "De beslissing heeft een titel.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-article-validation> sh:name "heeftDeel" ;
		sh:description "Duidt een artikel aan van dit besluit." ;
		sh:path <http://data.europa.eu/eli/ontology#has_part> ;
		sh:class <http://data.vlaanderen.be/ns/besluit#Artikel> ;
		sh:minCount 0 ;
        sh:resultMessage "Het artikel moet het juiste type hebben.";
        ext:successMessage "Het artikel is correct getypt.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-citation-validation> sh:name "citeert" ;
		sh:description "Een citatie in de wettelijke tekst. Dit omvat zowel woordelijke citaten als citaten in verwijzingen." ;
		sh:path <http://data.europa.eu/eli/ontology#cites> ;
		sh:class <http://data.europa.eu/eli/ontology#LegalExpression> ;
        sh:minCount 0 ;
        sh:resultMessage "De citatie moet het juiste type hebben.";
        ext:successMessage "De citatie is correct getypt.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-motivering-validation> sh:name "motivering" ;
		sh:description "Beschrijving van de juridische en feitelijke motivering achter de beslissing die wordt uitgedrukt in het besluit." ;
		sh:path <http://data.vlaanderen.be/ns/besluit#motivering> ;
		sh:or (
      [
        sh:datatype <http://www.w3.org/2001/XMLSchema#string>;
      ]
      [
        sh:datatype <http://www.w3.org/1999/02/22-rdf-syntax-ns#langString>;
      ]
    );
		sh:minCount 1 ;
		sh:maxCount 1 ;
        sh:resultMessage "Het besluit moet één motivering hebben.";
        ext:successMessage "Het besluit heeft een motivering.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-publication-date-validation> sh:name "publicatiedatum" ;
		sh:description "De officiële publicatiedatum van het besluit." ;
		sh:path <http://data.europa.eu/eli/ontology#date_publication> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#date> ;
        sh:minCount 0 ;
		sh:maxCount 1 ;
        sh:resultMessage "Het besluit mag niet meer dan één publicatiedatum hebben.";
        ext:successMessage "Het besluit heeft niet meer dan één publicatiedatum.".

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-date-no-longer-in-force-validation> sh:name "buitenwerkingtreding" ;
		sh:description "De laatste dag waarop de regelgeving nog van kracht is." ;
		sh:path <http://data.europa.eu/eli/ontology#date_no_longer_in_force> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#date> ;
        sh:minCount 0 ;
		sh:maxCount 1.

<https://data.vlaanderen.be/shacl/besluit-publicatie#besluit-first-date-entry-in-force-validation> sh:name "inwerkingtreding" ;
		sh:description "De datum waarop de regelgeving van kracht wordt." ;
		sh:path <http://data.europa.eu/eli/ontology#first_date_entry_in_force> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#date> ;
		sh:minCount 0 ;
		sh:maxCount 1.`;
