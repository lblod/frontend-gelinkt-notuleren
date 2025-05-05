import Controller from '@ember/controller';
import { task } from 'ember-concurrency';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import factory from '@rdfjs/dataset';
import SHACLValidator from 'rdf-validate-shacl';
import { Parser as ParserN3 } from 'n3';
import { RdfaParser } from 'rdfa-streaming-parser';
import type Features from 'ember-feature-flags';
import { service } from '@ember/service';
import { undo } from '@lblod/ember-rdfa-editor/plugins/history';

import { TRASH_STATUS_ID } from 'frontend-gelinkt-notuleren/utils/constants';
import StructureControlCardComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/structure-plugin/control-card';
import InsertArticleComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/decision-plugin/insert-article';

import { getActiveEditableNode } from '@lblod/ember-rdfa-editor/plugins/_private/editable-node';

import SnippetInsertRdfaComponent from '@lblod/ember-rdfa-editor-lblod-plugins/components/snippet-plugin/snippet-insert-rdfa';
import { fixArticleConnections } from '../../utils/fix-article-connections';
import { modifier } from 'ember-modifier';
import type StoreService from 'frontend-gelinkt-notuleren/services/gn-store';
import type RouterService from '@ember/routing/router-service';
import type DocumentService from 'frontend-gelinkt-notuleren/services/document-service';
import type IntlService from 'ember-intl/services/intl';
import type AgendapointEditorService from 'frontend-gelinkt-notuleren/services/editor/agendapoint';
import type {
  ProsePlugin,
  SayController,
  Schema,
} from '@lblod/ember-rdfa-editor';
import type EditorDocumentModel from 'frontend-gelinkt-notuleren/models/editor-document';
import type AgendapointsEditRoute from 'frontend-gelinkt-notuleren/routes/agendapoints/edit';
import type { ModelFrom } from 'frontend-gelinkt-notuleren/utils/types';
import ConceptModel from 'frontend-gelinkt-notuleren/models/concept';
import BehandelingVanAgendapunt from 'frontend-gelinkt-notuleren/models/behandeling-van-agendapunt';
import { unwrap } from '@lblod/ember-rdfa-editor-lblod-plugins/utils/option';

const besluitShape = `
@prefix sh:      <http://www.w3.org/ns/shacl#> .
@prefix qb:      <http://purl.org/linked-data/cube#> .
@prefix lblodBesluit:	<http://lblod.data.gift/vocabularies/besluit/> .
<https://data.vlaanderen.be/shacl/besluit-publicatie#BesluitShape>
	a sh:NodeShape ;
	sh:targetClass <http://data.vlaanderen.be/ns/besluit#Besluit> ;
	sh:property [
		sh:name "beschrijving" ;
		sh:description "Een beknopte beschrijving van het besluit." ;
		sh:path <http://data.europa.eu/eli/ontology#description> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#string> ;
        sh:minCount 0 ;
		sh:maxCount 1 ;
    sh:resultMessage "De besluit moet maximaal één beschrijving hebben"
	] ;
    sh:property [
		sh:name "inhoud" ;
		sh:description "De beschrijving van de beoogde rechtsgevolgen, het zogenaamde beschikkend gedeelte." ;
		sh:path <http://www.w3.org/ns/prov#value> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#string> ;
		sh:minCount 1 ;
		sh:maxCount 1 ;
    sh:resultMessage "De beslissing moet een artikelcontainer hebben";
	] ;
	sh:property [
		sh:name "citeeropschrift" ;
		sh:description "De beknopte titel of officiële korte naam van een decreet, wet, besluit... Deze wordt officieel vastgelegd. Deze benaming wordt in de praktijk gebruikt om naar de rechtsgrond te verwijzen." ;
		sh:path <http://data.europa.eu/eli/ontology#title_short> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#string> ;
        sh:minCount 0 ;
		sh:maxCount 1 ;
    sh:resultMessage "De beslissing mag niet meer dan één officiële titel hebben";
	] ;
    sh:property [
		sh:name "titel" ;
		sh:description "Titel van de legale verschijningsvorm." ;
		sh:path <http://data.europa.eu/eli/ontology#title> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#string> ;
		sh:minCount 1 ;
    sh:resultMessage "De besluit moet minstens één titel hebben";
	] ;
	sh:property [
		sh:name "taal" ;
		sh:description "De taal van de verschijningsvorm." ;
		sh:path <http://data.europa.eu/eli/ontology#language> ;
		sh:class <http://www.w3.org/2004/02/skos/core#Concept> ;
		sh:minCount 1 ;
		sh:maxCount 1 ;
		qb:codeList <http://publications.europa.eu/mdr/authority/language/index.html> ;
    sh:resultMessage "De besluit moet een geldige taal hebben"
	] ;
    sh:property [
		sh:name "heeftDeel" ;
		sh:description "Duidt een artikel aan van dit besluit." ;
		sh:path <http://data.europa.eu/eli/ontology#has_part> ;
		sh:class <http://data.vlaanderen.be/ns/besluit#Artikel> ;
		sh:minCount 0 ;
    sh:resultMessage "De artikelen moeten het juiste type hebben"
	] ;
    sh:property [
		sh:name "citeert" ;
		sh:description "Een citatie in de wettelijke tekst. Dit omvat zowel woordelijke citaten als citaten in verwijzingen." ;
		sh:path <http://data.europa.eu/eli/ontology#cites> ;
		sh:class <http://data.europa.eu/eli/ontology#LegalExpression> ;
    sh:minCount 0 ;
    sh:resultMessage "De citatie moeten het juiste type hebben"
	] ;
    sh:property [
		sh:name "motivering" ;
		sh:description "Beschrijving van de juridische en feitelijke motivering achter de beslissing die wordt uitgedrukt in het besluit." ;
		sh:path <http://data.vlaanderen.be/ns/besluit#motivering> ;
		sh:datatype <http://www.w3.org/1999/02/22-rdf-syntax-ns#langString> ;
		sh:minCount 1 ;
		sh:maxCount 1 ;
    sh:resultMessage "De besluit moet één motivering hebben"
	] ;
	sh:property [
		sh:name "publicatiedatum" ;
		sh:description "De officiële publicatiedatum van het besluit." ;
		sh:path <http://data.europa.eu/eli/ontology#date_publication> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#date> ;
    sh:minCount 0 ;
		sh:maxCount 1 ;
    sh:resultMessage "De besluit mag niet meer dan één publicatiedatum hebben"
	] ;
    sh:property [
		sh:name "buitenwerkingtreding" ;
		sh:description "De laatste dag waarop de regelgeving nog van kracht is." ;
		sh:path <http://data.europa.eu/eli/ontology#date_no_longer_in_force> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#date> ;
        sh:minCount 0 ;
		sh:maxCount 1 ;
	] ;
	sh:property [
		sh:name "inwerkingtreding" ;
		sh:description "De datum waarop de regelgeving van kracht wordt." ;
		sh:path <http://data.europa.eu/eli/ontology#first_date_entry_in_force> ;
		sh:datatype <http://www.w3.org/2001/XMLSchema#date> ;
		sh:minCount 0 ;
		sh:maxCount 1 ;
	] ;
	sh:closed false .
  `;

export default class AgendapointsEditController extends Controller {
  @service declare store: StoreService;
  @service declare router: RouterService;
  @service declare documentService: DocumentService;
  @service declare intl: IntlService;
  @service('editor/agendapoint')
  declare agendapointEditor: AgendapointEditorService;
  @service declare features: Features;

  declare model: ModelFrom<AgendapointsEditRoute>;

  @tracked hasDocumentValidationErrors = false;
  @tracked displayDeleteModal = false;
  @tracked _editorDocument?: EditorDocumentModel | null;
  @tracked controller?: SayController;
  @tracked schema?: Schema;
  @tracked plugins?: ProsePlugin[];
  @tracked editorSetup = false;

  StructureControlCard = StructureControlCardComponent;
  InsertArticle = InsertArticleComponent;

  SnippetInsert = SnippetInsertRdfaComponent;

  get config() {
    return this.agendapointEditor.config;
  }

  get nodeViews() {
    return this.agendapointEditor.nodeViews;
  }

  get dirty() {
    // Since we clear the undo history when saving, this works. If we want to maintain undo history
    // on save, we would need to add functionality to the editor to track what is the 'saved' state
    return this.controller?.checkCommand(undo, {
      view: this.controller?.mainEditorView,
    });
  }

  get editorDocument() {
    return this._editorDocument || this.model.editorDocument;
  }

  get documentContainer() {
    return this.model.documentContainer;
  }

  get activeNode() {
    if (this.controller) {
      return getActiveEditableNode(this.controller.activeEditorState);
    }
    return null;
  }

  get isBusy() {
    return (
      !this.editorSetup ||
      this.saveTask.isRunning ||
      this.copyAgendapunt.isRunning
    );
  }

  get busyText() {
    if (!this.editorSetup) {
      return this.intl.t('rdfa-editor-container.loading');
    }
    if (this.saveTask.isRunning) {
      return this.intl.t('rdfa-editor-container.making-copy');
    }
    if (this.copyAgendapunt.isRunning) {
      return this.intl.t('rdfa-editor-container.saving');
    }
    return '';
  }

  setSchemaAndPlugins = modifier(() => {
    const { schema, plugins } =
      this.agendapointEditor.getSchemaAndPlugins(false);
    this.schema = schema;
    this.plugins = plugins;
    this.editorSetup = true;
    return () => {
      this.editorSetup = false;
    };
  });

  @action
  handleRdfaEditorInit(editor: SayController) {
    this.controller = editor;
    editor.initialize(this.editorDocument?.content || '', { doNotClean: true });
  }

  copyAgendapunt = task(async () => {
    const response = await fetch(
      `/agendapoint-service/${this.documentContainer.id}/copy`,
      { method: 'POST' },
    );
    const json = (await response.json()) as Record<string, string>;
    const agendapuntId = json['uuid'];
    await this.router.transitionTo('agendapoints.edit', agendapuntId);
  });

  @action
  toggleDeleteModal() {
    this.displayDeleteModal = !this.displayDeleteModal;
  }

  @action
  closeValidationModal() {
    this.hasDocumentValidationErrors = false;
  }

  @action
  async deleteDocument() {
    const container = this.documentContainer;
    const deletedStatus = await this.store.findRecord<ConceptModel>(
      'concept',
      TRASH_STATUS_ID,
    );
    container.set('status', deletedStatus);
    await container.save();
    this.displayDeleteModal = false;
    this.router.transitionTo('inbox.agendapoints');
  }

  onTitleUpdate = task(async (title: string) => {
    const html = this.editorDocument?.content ?? '';

    const behandeling = (
      await this.store.query<BehandelingVanAgendapunt>(
        'behandeling-van-agendapunt',
        {
          'filter[document-container][:id:]': this.model.documentContainer.id,
        },
      )
    )[0];
    if (behandeling) {
      const agendaItem = unwrap(await behandeling.onderwerp);
      agendaItem.titel = title;
      await agendaItem.save();
    }

    const editorDocument =
      await this.documentService.createEditorDocument.perform(
        title,
        html,
        this.documentContainer,
        this.editorDocument ?? undefined,
      );

    this._editorDocument = editorDocument;
  });

  saveTask = task(async () => {
    if (!this.controller || !this.editorDocument) {
      return;
    }
    const fixArticleConnectionsTr = fixArticleConnections(
      this.controller.mainEditorState,
    );
    if (fixArticleConnectionsTr) {
      this.controller.mainEditorView.dispatch(fixArticleConnectionsTr);
    }
    if (!this.editorDocument.title) {
      this.hasDocumentValidationErrors = true;
    } else {
      this.hasDocumentValidationErrors = false;
      const html = this.controller.htmlContent;
      const cleanedHtml = this.removeEmptyDivs(html);

      const rdf = await htmlToRdf(cleanedHtml);
      const shacl = await parse(besluitShape);
      const validator = new SHACLValidator(shacl, {
        allowNamedNodeInList: true,
      });
      const report = await validator.validate(rdf);
      console.log(shaclReportToMessage(report));

      const editorDocument =
        await this.documentService.createEditorDocument.perform(
          this.editorDocument.title,
          cleanedHtml,
          this.documentContainer,
          this.editorDocument,
        );
      this._editorDocument = editorDocument;
    }
  });

  removeEmptyDivs(html: string) {
    const parserInstance = new DOMParser();
    const parsedHtml = parserInstance.parseFromString(html, 'text/html');
    const besluitIdentifiers = {
      prefixed: 'besluit:Besluit',
      full: 'http://data.vlaanderen.be/ns/besluit#Besluit',
    };
    const besluitDivs = parsedHtml.querySelectorAll(
      `div[typeof~="${besluitIdentifiers.prefixed}"], div[typeof~="${besluitIdentifiers.full}"]`,
    );
    besluitDivs.forEach((besluitDiv) => {
      if ((besluitDiv.textContent ?? '').trim() === '') {
        besluitDiv.remove();
      }
    });

    return parsedHtml.body.innerHTML;
  }
}

async function parse(triples) {
  return new Promise((resolve, reject) => {
    const parser = new ParserN3();
    const dataset = factory.dataset();
    parser.parse(triples, (error, quad) => {
      if (error) {
        console.warn(error);
        reject(error);
      } else if (quad) {
        dataset.add(quad);
      } else {
        resolve(dataset);
      }
    });
  });
}

function htmlToRdf(html) {
  return new Promise((res, rej) => {
    const myParser = new RdfaParser({ contentType: 'text/html' });
    const dataset = factory.dataset();
    myParser
      .on('data', (data) => {
        dataset.add(data);
      })
      .on('error', rej)
      .on('end', () => res(dataset));
    myParser.write(html);
    myParser.end();
  });
}

function shaclSeverityToString(severity) {
  const uri = severity.value;
  return uri.replace('http://www.w3.org/ns/shacl#', '');
}

export function shaclReportToMessage(report) {
  let reportString = '\n';
  for (const r of report.results) {
    let description = '';
    const shapeId = r.sourceShape.id;
    for (let [_, quad] of r.dataset._quads) {
      if (
        quad._subject?.id === shapeId &&
        quad._predicate?.id === 'http://www.w3.org/ns/shacl#resultMessage'
      ) {
        description = quad._object.id;
        break;
      }
    }
    const severity = shaclSeverityToString(r.severity);
    reportString += `${severity} - ${description} - ${r.path.value} (${r.focusNode.value})\n`;
  }
  return reportString;
}
