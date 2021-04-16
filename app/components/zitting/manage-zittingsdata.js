import Component from '@glimmer/component';
import { action } from "@ember/object";
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class ZittingManageZittingsdataComponent extends Component {
  @tracked showModal = false;

  @tracked geplandeStart;
  @tracked gestartOpTijdstip;
  @tracked geeindigdOpTijdstip;
  @tracked opLocatie;
  @tracked bestuursorgaan;
  @tracked bestuursorgaanOptions;

  @service store;
  @service currentSession;

  allowedBestuursorgaanClassifications = [
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000005", //	"Gemeenteraad"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000007", //	"Raad voor Maatschappelijk Welzijn"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000009", //	"Bijzonder Comité voor de Sociale Dienst"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000a", //	"Districtsraad"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000c", //	"Provincieraad"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/53c0d8cd-f3a2-411d-bece-4bd83ae2bbc9", //	"Voorzitter van het Bijzonder Comité voor de Sociale Dienst"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/9314533e-891f-4d84-a492-0338af104065", //	"Districtsburgemeester"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000b", //	"Districtscollege"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/180a2fba-6ca9-4766-9b94-82006bb9c709", //	"Gouverneur"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/e14fe683-e061-44a2-b7c8-e10cab4e6ed9", //	"Voorzitter van de Raad voor Maatschappelijk Welzijn"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000006", //	"College van Burgemeester en Schepenen"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4c38734d-2cc1-4d33-b792-0bd493ae9fc2", //	"Voorzitter van de Gemeenteraad"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e00000d", //	"Deputatie"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/4955bd72cd0e4eb895fdbfab08da0284", //	"Burgemeester"
    "http://data.vlaanderen.be/id/concept/BestuursorgaanClassificatieCode/5ab0e9b8a3b2ca7c5e000008" //	"Vast Bureau"
  ];

  constructor() {
    super(...arguments);
    this.initializeState();
  }
  initializeState() {
    this.zitting = this.args.zitting;
    this.geplandeStart = this.args.zitting.geplandeStart;
    this.gestartOpTijdstip = this.args.zitting.gestartOpTijdstip;
    this.geeindigdOpTijdstip = this.args.zitting.geeindigdOpTijdstip;
    this.opLocatie = this.args.zitting.opLocatie;
    this.bestuursorgaan = this.args.zitting.bestuursorgaan;

  }

  @action
  async fetchBestuursorgaan() {
    // TODO: Move select Bestuursorgaan to component
    const currentBestuurseenheid = this.currentSession.group;
    let query = {
      'filter[is-tijdsspecialisatie-van][bestuurseenheid][id]': currentBestuurseenheid.id,
      'include':'is-tijdsspecialisatie-van,is-tijdsspecialisatie-van.bestuurseenheid,is-tijdsspecialisatie-van.classificatie',
      'sort': '-binding-start'
    };
    let bestuursorganenInTijd = await this.store.query('bestuursorgaan', query);
    bestuursorganenInTijd = bestuursorganenInTijd.filter(b => this.allowedBestuursorgaanClassifications.includes(b.get('isTijdsspecialisatieVan.classificatie.uri')));
    this.bestuursorgaanOptions = bestuursorganenInTijd;
  }

  @action
  async saveZittingsData(){
    this.zitting.geplandeStart = this.geplandeStart;
    this.zitting.gestartOpTijdstip = this.gestartOpTijdstip;
    this.zitting.geeindigdOpTijdstip = this.geeindigdOpTijdstip;
    this.zitting.opLocatie = this.opLocatie;
    this.zitting.bestuursorgaan = this.bestuursorgaan;

    if(!this.zitting.id){
      await this.zitting.save();
      this.args.onCreate(this.zitting);
    }
    else {
      await this.zitting.save();
      this.showModal = !this.showModal;
      this.args.onChange(this.zitting);
    }
  }

  @action
  async changeSelect(bestuursorgaan) {
    this.bestuursorgaan = bestuursorgaan;
    this.zitting.voorzitter = undefined;
    this.zitting.secretaris = undefined;
    this.zitting.aanwezigenBijStart = [];
  }

  @action
  cancel() {
    this.zitting.rollbackAttributes();
    this.initializeState();
    this.toggleModal();
  }
  @action
  toggleModal() {
    this.showModal = !this.showModal;
  }

  @action
  changeDate(targetProperty, value) {
    this[targetProperty] = value;
  }

}
