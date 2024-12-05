# frontend-gelinkt-notuleren

## 5.44.1

### Patch Changes

- [`b92513e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b92513eea5a3afec6d230f86fb54d2ccdcd75115) Thanks [@elpoelma](https://github.com/elpoelma)! - Revert accidental `shouldEditRdfa` change

## 5.44.0

### Minor Changes

- [#785](https://github.com/lblod/frontend-gelinkt-notuleren/pull/785) [`7985754`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7985754e5a5f1234953818ff48d0a0bcf9222d95) Thanks [@elpoelma](https://github.com/elpoelma)! - Add fusietemplates to installatievergadering-api configuration

### Patch Changes

- [#785](https://github.com/lblod/frontend-gelinkt-notuleren/pull/785) [`7985754`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7985754e5a5f1234953818ff48d0a0bcf9222d95) Thanks [@elpoelma](https://github.com/elpoelma)! - Rework installatievergadering API a bit for clarity

- [`a841179`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a841179e8bff65b3abaff93342f683793052b625) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix: automatically connect articles to parent decision upon opening an agendapoint

- [#786](https://github.com/lblod/frontend-gelinkt-notuleren/pull/786) [`3a90ef5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/3a90ef5a9ffc8cbe585dd77d933b4ba4344b4c5b) Thanks [@elpoelma](https://github.com/elpoelma)! - Slightly modernize the meeting page styling by moving to a flex-based layout

- [#784](https://github.com/lblod/frontend-gelinkt-notuleren/pull/784) [`daea8f5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/daea8f5e3dbd64e114aed584b7e986f2a8c8193e) Thanks [@piemonkey](https://github.com/piemonkey)! - Update mandatee table queries for IVs to sort fracties with the same number of seats by number of votes

## 5.43.3

### Patch Changes

- [#782](https://github.com/lblod/frontend-gelinkt-notuleren/pull/782) [`28f57ed`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/28f57ed34462f6f48e91cdad0160ef4f817b1365) Thanks [@elpoelma](https://github.com/elpoelma)! - Work around virtuoso optional-nested-select duplication bug by replacing `OPTIONAL` statements by `UNION` statements

## 5.43.2

### Patch Changes

- [#781](https://github.com/lblod/frontend-gelinkt-notuleren/pull/781) [`03bd2d5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/03bd2d500b60dbec99e83e96e2adac59c072da53) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version [10.9.0](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.9.0)

## 5.43.1

### Patch Changes

- [#780](https://github.com/lblod/frontend-gelinkt-notuleren/pull/780) [`509dc29`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/509dc29eb851342642aaea696347061e1637c71d) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix agendapoint not generated bug when creating a IV with Ronse and Voeren

- [#779](https://github.com/lblod/frontend-gelinkt-notuleren/pull/779) [`25a7190`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/25a71905beaf4b0b871f89b8fb384757e1d955dd) Thanks [@elpoelma](https://github.com/elpoelma)! - Adjust mandatee queries to explicitly include the `rdf:type` of URIs which are consumed from LMB. This prevents us from querying tombstones.

## 5.43.0

### Minor Changes

- [#778](https://github.com/lblod/frontend-gelinkt-notuleren/pull/778) [`bd204e8`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/bd204e831f1311283ea9d3b75041a3f0846e402c) Thanks [@elpoelma](https://github.com/elpoelma)! - RMW mandatee table adjustments:
  - Add `mandaat:bekrachtigtAanstellingVan` predicate to mandatees in 'Eedafleggingen' table (`IVRMW2-LBM-5-eed-leden`)
  - Remove `mandaat:bekrachtigtAanstellingVan` predicate from 'Verkiezingen' table (`IVRMW2-LBM-3-verkiezing-leden`)

### Patch Changes

- [`954220b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/954220bc5bb4be353bfcf0c1432b16ff16533dcd) Thanks [@abeforgit](https://github.com/abeforgit)! - Do not add ex-chairperson to participant list

## 5.42.3

### Patch Changes

- [#777](https://github.com/lblod/frontend-gelinkt-notuleren/pull/777) [`1cd28f5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/1cd28f5d5f3f03ba57c96674f4df0048fabfe722) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix bug with LMB synchronisation by not autofilling variables in headless editors

## 5.42.2

### Patch Changes

- [`5df910d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5df910dbca5f69825fc4f7b1f513e7cdcc426f3e) Thanks [@abeforgit](https://github.com/abeforgit)! - dont add previous chairman to participants if that person is already in that list

## 5.42.1

### Patch Changes

- [#776](https://github.com/lblod/frontend-gelinkt-notuleren/pull/776) [`6b92eb8`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6b92eb8fd26d2255dc401484c305abc52ead5ad2) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix contact page

## 5.42.0

### Minor Changes

- [`f4e9351`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f4e935125cc3aef5278a8bc32017e87791bd2930) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [v26.0.2](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v26.0.2) and editor to [v10.8.0](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.8.0)

### Patch Changes

- [#775](https://github.com/lblod/frontend-gelinkt-notuleren/pull/775) [`c2de080`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c2de080513a3820def9945a2d29e7ecb1315db27) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix model configuration for publishing logs of IV meetings

## 5.41.5

### Patch Changes

- [#773](https://github.com/lblod/frontend-gelinkt-notuleren/pull/773) [`1175960`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/11759608ffb50bf15e096462edd075e484e24071) Thanks [@elpoelma](https://github.com/elpoelma)! - Agendapoint headless editor: ensure the necessary RDFa plugins are configured for the headless editor to work as expected

- [#772](https://github.com/lblod/frontend-gelinkt-notuleren/pull/772) [`d4afe53`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d4afe530100eceead1b5aaba312f920a8411ee84) Thanks [@elpoelma](https://github.com/elpoelma)! - Update editor-plugins to version [26.0.1](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v26.0.1)

- [#772](https://github.com/lblod/frontend-gelinkt-notuleren/pull/772) [`d4afe53`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d4afe530100eceead1b5aaba312f920a8411ee84) Thanks [@elpoelma](https://github.com/elpoelma)! - Update @lblod/template-uuid-instantiator to version [1.0.3](https://github.com/lblod/template-uuid-instantiator/releases/tag/v1.0.3)

## 5.41.4

### Patch Changes

- [`2272b09`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2272b094894cae034809a0ca199f2652a13d07ce) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [v25.2.2](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v25.2.2)

## 5.41.3

### Patch Changes

- [`83d30c9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/83d30c91b17b731969c944821c0a98581504f667) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor to [v10.7.4](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.7.4)

- [#771](https://github.com/lblod/frontend-gelinkt-notuleren/pull/771) [`014fe5c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/014fe5c61e7a6abc9c1cbd7198a2843d9eae2797) Thanks [@elpoelma](https://github.com/elpoelma)! - Rework how meeting page buttons are hidden when media="print"

- [#770](https://github.com/lblod/frontend-gelinkt-notuleren/pull/770) [`890efcd`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/890efcda11b659bc5a561c5810a685c48917b900) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure diaeresis are taken into account when converting mandatee rank to number

- [#768](https://github.com/lblod/frontend-gelinkt-notuleren/pull/768) [`e91a8ce`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e91a8ceb9d489ab83066442b73d31354d64310aa) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix codelist and locations in agendapoint editor

## 5.41.2

### Patch Changes

- [#766](https://github.com/lblod/frontend-gelinkt-notuleren/pull/766) [`88e3d26`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/88e3d26aa3414d8129ac6a45297ea93caf7746fa) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fix ember application plugin configuration error

- [#767](https://github.com/lblod/frontend-gelinkt-notuleren/pull/767) [`5d58d7d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5d58d7d206de043341f7b44521016d1572b09a69) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix incorrect zitting intro/outro/custom-voting translations

## 5.41.1

### Patch Changes

- [`11e961d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/11e961df944508897fe5b8a1cb7a8fc2313eca99) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix configuration of `snippet_placeholder` node and nodeview

## 5.41.0

### Minor Changes

- [#765](https://github.com/lblod/frontend-gelinkt-notuleren/pull/765) [`001c7c3`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/001c7c3bca5706af075ac428b93ab7195e7238d2) Thanks [@elpoelma](https://github.com/elpoelma)! - - Adjust logic of meeting creation modal:

  - Only allow the selection of 'bestuursorganen' which are active on the selected 'planned start' date
  - When modifying the 'planned start' date, clear the 'bestuursorgaan' if necessary.

  * Modernize `administrative-body-select` component

- [#732](https://github.com/lblod/frontend-gelinkt-notuleren/pull/732) [`677da80`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/677da8049ac6cb0dc531be9355ca7ecac3859633) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add a way of adding a custom voting

### Patch Changes

- [#764](https://github.com/lblod/frontend-gelinkt-notuleren/pull/764) [`100044b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/100044bba69ff4f99c5c000d1d067b915302b349) Thanks [@elpoelma](https://github.com/elpoelma)! - Meeting attendee modal: ensure only mandatees with a linked person are displayed

## 5.40.0

### Minor Changes

- [#763](https://github.com/lblod/frontend-gelinkt-notuleren/pull/763) [`1def2b1`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/1def2b1a6a0d2494ecb3d014d6be1767146d0a1e) Thanks [@elpoelma](https://github.com/elpoelma)! - bump plugins to [v25.2.0](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v25.2.0)

  - set up config for new snippet placeholder UI

### Patch Changes

- [`bc109e9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/bc109e9b1c98538b9c782a1a30909c87e4c71999) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Update ember-rdfa-editor to 10.7.3 and ember-rdfa-editor-lblod-plugins to 25.2.1

## 5.39.0

### Minor Changes

- [`0ffdffb`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0ffdffbb8d1bf24d9ac122aaa0bfe3b1d62361fe) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor to [v10.7.2](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.7.2) and plugins to [v25.1.0](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v25.1.0)

### Patch Changes

- [#759](https://github.com/lblod/frontend-gelinkt-notuleren/pull/759) [`0b15894`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0b158942a840957e614f07bb6e43ef7992e8d11c) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add agendapoint numbers to download table

- [#761](https://github.com/lblod/frontend-gelinkt-notuleren/pull/761) [`51469e4`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/51469e4076210c19daca7c880eb3b38fa673c5fd) Thanks [@piemonkey](https://github.com/piemonkey)! - Update to ember-rdfa-editor-lblod-plugins v24.3.2 to get snippet URI fix

- [#758](https://github.com/lblod/frontend-gelinkt-notuleren/pull/758) [`be6b33b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/be6b33bfdf440d23051a807fe4be3b9ea2f0ea4f) Thanks [@abeforgit](https://github.com/abeforgit)! - use cached endpoint for lmb plugin

- [#761](https://github.com/lblod/frontend-gelinkt-notuleren/pull/761) [`642c059`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/642c059da23bfb8954bf14937b58c63fc8736945) Thanks [@piemonkey](https://github.com/piemonkey)! - Correct generated URI for inserted articles in decisions

- [`4c75a3e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4c75a3e19e72f76e87e2f2287ba73a219700ae83) Thanks [@abeforgit](https://github.com/abeforgit)! - Correctly set IV config for special municipalities

- [#762](https://github.com/lblod/frontend-gelinkt-notuleren/pull/762) [`b659539`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b65953925c8c563ad0e292b64df3addb44dc2c86) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version [10.7.1](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.7.1)

- [#760](https://github.com/lblod/frontend-gelinkt-notuleren/pull/760) [`93cb34d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/93cb34d38390b7c90e02bdd45296ed1ac2e1a68b) Thanks [@elpoelma](https://github.com/elpoelma)! - IV Mandatee table queries: do not include fractions which do not have any seats

## 5.38.0

### Minor Changes

- [#756](https://github.com/lblod/frontend-gelinkt-notuleren/pull/756) [`9b121b5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9b121b5ce5d93f2d8cba0ee33dc32041e455f733) Thanks [@elpoelma](https://github.com/elpoelma)! - Meeting participation modal: include adminstration period of mandatees

- [#756](https://github.com/lblod/frontend-gelinkt-notuleren/pull/756) [`ccbb557`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ccbb55759b078a8b7dc6b4a290d04230f87a515b) Thanks [@elpoelma](https://github.com/elpoelma)! - Inauguration meetings: ensure that the chairman of the previous legislation may be selected as chairman and attendee

- [#751](https://github.com/lblod/frontend-gelinkt-notuleren/pull/751) [`59a10ac`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/59a10acd5d588c4dcf9e6a387b85b16deb625f6d) Thanks [@elpoelma](https://github.com/elpoelma)! - Add `emberApplication` prosemirror plugin to `zitting-text-document-container` component

### Patch Changes

- [#750](https://github.com/lblod/frontend-gelinkt-notuleren/pull/750) [`fbd1953`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/fbd1953cb6e1c27e3a59af027ccf6715910b4ac2) Thanks [@elpoelma](https://github.com/elpoelma)! - Hide mandatee-table editor feature behind feature-flag `mandatee-table-editor`

- [#752](https://github.com/lblod/frontend-gelinkt-notuleren/pull/752) [`d9e559c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d9e559c2e445a24a986d85a21ddf85d2801399f9) Thanks [@elpoelma](https://github.com/elpoelma)! - bump plugins to [v24.3.1](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.3.1)

- [#755](https://github.com/lblod/frontend-gelinkt-notuleren/pull/755) [`b59829f`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b59829f35c123be984a4b42b3fdc1c202f3bd335) Thanks [@abeforgit](https://github.com/abeforgit)! - Clarify wording in export page

- [#754](https://github.com/lblod/frontend-gelinkt-notuleren/pull/754) [`b003ecb`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b003ecb8be378e701e800ab5ccc7ef3b3b66c4b3) Thanks [@abeforgit](https://github.com/abeforgit)! - Set meeting start date to planned start for new IVs

- [#757](https://github.com/lblod/frontend-gelinkt-notuleren/pull/757) [`0bc0d88`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0bc0d8897ec6ee03df02d3a64838563ef6029140) Thanks [@elpoelma](https://github.com/elpoelma)! - Disable creation of inauguration meeting if not applicable.
  To be able to create an inauguration meeting, you should be logged in as a:

  - Gemeente
  - District
  - OCMW
    The logged-in administrative unit should be relevant for the next legislation (e.g. no old, no longer existing muncipalities)

- [#753](https://github.com/lblod/frontend-gelinkt-notuleren/pull/753) [`7409997`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/740999713108fffa919c0a3b9f63dc5008a4f9f9) Thanks [@elpoelma](https://github.com/elpoelma)! - IV creation: ensure decision templates are correctly instantiated upon meeting creation

## 5.37.0

### Minor Changes

- [`eabfb71`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/eabfb71ac06524052c061197b62eaa593cfa6c81) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor to [v10.7.0](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.7.0)

## 5.36.1

### Patch Changes

- [`1380706`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/13807061a87918827e78192ad2e5a255595b4956) Thanks [@abeforgit](https://github.com/abeforgit)! - Only insert name of municipality for autovars

- [`55672a9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/55672a976278a1a7630136e86afbe48aaa4a421d) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [v24.3.0](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.3.0)

## 5.36.0

### Minor Changes

- [#744](https://github.com/lblod/frontend-gelinkt-notuleren/pull/744) [`2d9afb7`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2d9afb75d15c9fbaa1a438a0e9f20795cf49bc81) Thanks [@elpoelma](https://github.com/elpoelma)! - Add `bestuursperiode` ember-data model.
  This model represents the legislation periode for a specific bestuursorgaan.

- [#746](https://github.com/lblod/frontend-gelinkt-notuleren/pull/746) [`6bb3107`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6bb310750f2670a9d127e99023ad5a02ee68baf6) Thanks [@elpoelma](https://github.com/elpoelma)! - **IVGR LMB table queries**
  Introduce deterministic ordering. Mandatees/fractions will be ordered by:

  - Fraction size
  - Mandatee name in alphabetical order

- [#746](https://github.com/lblod/frontend-gelinkt-notuleren/pull/746) [`3fc060b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/3fc060bbb904b54ac9cd41c86d437201290334b7) Thanks [@elpoelma](https://github.com/elpoelma)! - **IVGR LMB table queries**
  Introduce deterministic ordering. Depending on the query/table, mandatees/fractions will be ordered by:

  - Fraction size
  - Amount of votes
  - Mandatee rank

- [#742](https://github.com/lblod/frontend-gelinkt-notuleren/pull/742) [`b3c0605`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b3c0605b3f007ad8cadcae4a5172b966c9b5ebe2) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure the correct 'bestuursorgaan-in-tijd' is selected when syncing an IV

- [#747](https://github.com/lblod/frontend-gelinkt-notuleren/pull/747) [`a1988b2`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a1988b25f8afa796f929100c1b82eb40934b1522) Thanks [@piemonkey](https://github.com/piemonkey)! - Add styling for agendapoint numbers next to titles in prepublish flow

### Patch Changes

- [#744](https://github.com/lblod/frontend-gelinkt-notuleren/pull/744) [`4ea943a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4ea943af418b2eeeaddca67bd950f16bd7784d8a) Thanks [@elpoelma](https://github.com/elpoelma)! - When creating a new inauguration meeting,
  automatically select the bestuursorgaan corresponding to the '2024-...'bestuursperiode.

- [`eec9e2c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/eec9e2cfd8f9adcdc5679c401351909d8e306774) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [v24.2.2](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.2.2)

- [#742](https://github.com/lblod/frontend-gelinkt-notuleren/pull/742) [`a2981c5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a2981c58f9427d761275a167cfa692a0250bfed5) Thanks [@elpoelma](https://github.com/elpoelma)! - Change endpoints from LMB plugin and mandatee table to use the backend

- [#748](https://github.com/lblod/frontend-gelinkt-notuleren/pull/748) [`0bd0edf`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0bd0edf17e9adecf99c83b8390bf852249e927f9) Thanks [@elpoelma](https://github.com/elpoelma)! - Disable `rdfa-aware` setting for `heading` nodes

- [`3aa5f4d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/3aa5f4db59fb5c080e43cedc7d63a7e1876480e6) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [v24.2.3](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.2.3)

- [#749](https://github.com/lblod/frontend-gelinkt-notuleren/pull/749) [`250b10d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/250b10d5f0c5dc9126138921dab4e806600da9a9) Thanks [@piemonkey](https://github.com/piemonkey)! - Update copy-decision-parts screen to better handle single articles

## 5.35.0

### Minor Changes

- [#736](https://github.com/lblod/frontend-gelinkt-notuleren/pull/736) [`d6e5731`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d6e573115cec0a5f5fd1b0e577d12af19ad8db4f) Thanks [@elpoelma](https://github.com/elpoelma)! - **LMB IV RMW tables**
  Add configs for the necessary LMB tables for the RMW IV

- [#738](https://github.com/lblod/frontend-gelinkt-notuleren/pull/738) [`0170e3e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0170e3e1b4d8da72ed0c2c5fbcf563fe45f8f5c9) Thanks [@elpoelma](https://github.com/elpoelma)! - Partly refactor `AgendapointEditController` into seperate ember service:
  - Move `schema`, `plugins`, `nodeviews` and config to the `AgendapointEditorService`
  - Allows for easily sharing these settings between the headful and headless editor instances
  - Service includes a method to easily compute a state based on a passed html string

### Patch Changes

- [#741](https://github.com/lblod/frontend-gelinkt-notuleren/pull/741) [`40942e1`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/40942e136e95e6b4ec2d4c720f5252809d2a2e85) Thanks [@elpoelma](https://github.com/elpoelma)! - Implement a more extendable way to determine the correct bestuursorgaan-classificatie for a new inauguration meeting

- [#737](https://github.com/lblod/frontend-gelinkt-notuleren/pull/737) [`86abc61`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/86abc61f0cd32fd9ba8e2865a522ef3a7be66929) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix handling of motivation section when copying parts of decisions to clipboard

- [`767c1be`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/767c1be58bf7d02288ff7a15abf7d08a4435bc60) Thanks [@abeforgit](https://github.com/abeforgit)! - Bump plugins to [v24.2.1](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.2.1)

- [#739](https://github.com/lblod/frontend-gelinkt-notuleren/pull/739) [`cda985e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/cda985e878cf3f8374e86741bddc301a0a9d1a73) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fixed bug where deleting the meeting was not possible

- [#740](https://github.com/lblod/frontend-gelinkt-notuleren/pull/740) [`930f963`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/930f963fed02d0693bf3fd5d605f8a831fe73830) Thanks [@elpoelma](https://github.com/elpoelma)! - **IVGR LMB tables: adjust fractie-splitsing query**

  - Adjustment in how verkiezing and kieslijsten are determined
  - Fix variable name

- [`198f916`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/198f916cd7ce03af8860c1e58bb2bfa510f25e73) Thanks [@abeforgit](https://github.com/abeforgit)! - Use safe getters for auth info in editor config service

- [#738](https://github.com/lblod/frontend-gelinkt-notuleren/pull/738) [`f7a212a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f7a212aa827a3659b2cf450275c03ed73cac2b42) Thanks [@elpoelma](https://github.com/elpoelma)! - Adjustments to headless prosemirror schema used for processing agendapoints:
  - Use `WithConfig` versions of node-specs where possible
  - Include `person_variable` and `autofilled_variable`

## 5.34.1

### Patch Changes

- [`f185ac0`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f185ac040ce382dde3530478c6ef9345c89538d4) Thanks [@abeforgit](https://github.com/abeforgit)! - fix alignment in synchronization modal

## 5.34.0

### Minor Changes

- [#735](https://github.com/lblod/frontend-gelinkt-notuleren/pull/735) [`d25b883`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d25b883090b399523e1df3fea7538e8d1ba12b75) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add focus besluit mode to the meeting form

### Patch Changes

- [`0a5daee`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0a5daeedfc07377b506bc1bf51a392aa7b5a4b86) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [24.1.1](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.1.1)

- [`9d11674`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9d11674f11b7e871610dfaf24e52a264aa7ced46) Thanks [@abeforgit](https://github.com/abeforgit)! - fix copy on chrome and add plaintext version to clipboard

- [`e745582`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e745582bb7b37c7d23adec58804cbb982eb62d1d) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [24.1.2](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.1.2)

## 5.33.1

### Patch Changes

- [`f2a6314`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f2a63141a5128065afa1409e869952cc3135886e) Thanks [@abeforgit](https://github.com/abeforgit)! - update meeting configs

## 5.33.0

### Minor Changes

- [#731](https://github.com/lblod/frontend-gelinkt-notuleren/pull/731) [`0277635`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0277635f09906a59d4979bf124a56cebc483c661) Thanks [@piemonkey](https://github.com/piemonkey)! - Add functionality to copy parts of a decision from the meeting copy-parts page

- [#730](https://github.com/lblod/frontend-gelinkt-notuleren/pull/730) [`ca64f65`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ca64f658e28e617d58766d3e63660850cf017b3c) Thanks [@elpoelma](https://github.com/elpoelma)! - **LMB IV GR tables**
  Add a `IVGR7-LMB-3-verhindering-schepenen` config which lists the 'schepenen' who have a status of 'verhinderd'

- [#729](https://github.com/lblod/frontend-gelinkt-notuleren/pull/729) [`b32953a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b32953ad8e53314c5defcd68dbc30c8108c27932) Thanks [@elpoelma](https://github.com/elpoelma)! - IVGR4-LMB-1 rangorde gemeenteraadsleden: add support for the 'rangorde' column.

- [`0289964`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0289964a500f90ea96fe240e5e171a793ebac3e9) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [24.1.0](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v24.1.0)

- [#734](https://github.com/lblod/frontend-gelinkt-notuleren/pull/734) [`032704b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/032704b3c45cd564098f61c3df465d2b25432756) Thanks [@abeforgit](https://github.com/abeforgit)! - switch to new period for lmb queries

- [#733](https://github.com/lblod/frontend-gelinkt-notuleren/pull/733) [`9a351fc`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9a351fc9c1b9fea71955ffe8248e1f27be1e6fa9) Thanks [@abeforgit](https://github.com/abeforgit)! - Add system for meeting variants

### Patch Changes

- [#730](https://github.com/lblod/frontend-gelinkt-notuleren/pull/730) [`4459ac4`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4459ac423eb7e80cb9b3cc8d9da06a18d0098839) Thanks [@elpoelma](https://github.com/elpoelma)! - **LMB IV GR tables**
  Introduce correction in `IVGR7-LMB-2-ontvankelijkheid-schepenen` on start and end of mandate

- [#730](https://github.com/lblod/frontend-gelinkt-notuleren/pull/730) [`e3da7c9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e3da7c9ea801c4d8324c122c1989957e5595cb78) Thanks [@elpoelma](https://github.com/elpoelma)! - **LMB IV GR tables**
  Remove erroneous 'mandaat:bekrachtigdAanstellingVan' relationship from `IVGR8-LMB-1-verkozen-schepenen` table

- [#730](https://github.com/lblod/frontend-gelinkt-notuleren/pull/730) [`9e68b55`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9e68b55203771655233713056d04dcb42ce82eb1) Thanks [@elpoelma](https://github.com/elpoelma)! - **LMB IV GR tables**
  Remove erroneous 'mandaat:bekrachtigdAanstellingVan' relationship from `IVGR7-LMB-1-kandidaat-schepenen` table

## 5.32.0

### Minor Changes

- [#728](https://github.com/lblod/frontend-gelinkt-notuleren/pull/728) [`354371c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/354371c06c2c784c267c5a4e9f11c32d892a22e0) Thanks [@piemonkey](https://github.com/piemonkey)! - Add screen within meeting download options to allow for copying of the decision to the clipboard

## 5.31.2

### Patch Changes

- [`598529a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/598529a8982a7f0a58adbc0a1ccab7e57ade1b22) Thanks [@abeforgit](https://github.com/abeforgit)! - Select IV templates based on name so they work in all envs

## 5.31.1

### Patch Changes

- [#727](https://github.com/lblod/frontend-gelinkt-notuleren/pull/727) [`16735bb`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/16735bba5e800e4645e453bfdf77ba9cee7cee18) Thanks [@elpoelma](https://github.com/elpoelma)! - LMB IV GR config: ensure queries filter on bestuursfunctie 'gemeenteraadslid' where necessary

## 5.31.0

### Minor Changes

- [#711](https://github.com/lblod/frontend-gelinkt-notuleren/pull/711) [`d3f4f25`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d3f4f255eace6a55f67122a2faba7fdc35d14a97) Thanks [@elpoelma](https://github.com/elpoelma)! - Add inital mandatee table config containing the different configurations/queries needed for the inauguration meeting

- [#724](https://github.com/lblod/frontend-gelinkt-notuleren/pull/724) [`f71851b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f71851b6cb3e95e65cc91fb87733277b8c2802e6) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Correctly instantiate templates coming from RB

- [#714](https://github.com/lblod/frontend-gelinkt-notuleren/pull/714) [`f5570f6`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f5570f6a6c7e665e35d58178d7792386ff554d3c) Thanks [@abeforgit](https://github.com/abeforgit)! - Inital version of loading correct templates upon IV creation

- [#722](https://github.com/lblod/frontend-gelinkt-notuleren/pull/722) [`b14af9d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b14af9dbb711036bad924be48a2bf9b78060e39b) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Users can now download certain meeting parts as HTML

### Patch Changes

- [#726](https://github.com/lblod/frontend-gelinkt-notuleren/pull/726) [`a46d2ed`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a46d2edecadc2a166ca4794b036ff2687249af86) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Insert menu is open by default now and moved insert snippet button to the bottom of the list

## 5.30.0

### Minor Changes

- [#715](https://github.com/lblod/frontend-gelinkt-notuleren/pull/715) [`4d360d8`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4d360d8d3ff1b7bb167b937b846e641525616a34) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Implement autofill variable

## 5.29.0

### Minor Changes

- [#723](https://github.com/lblod/frontend-gelinkt-notuleren/pull/723) [`53999b8`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/53999b82bc7de5f78919e7884116f6a1adc2ed33) Thanks [@piemonkey](https://github.com/piemonkey)! - Add option to export HTML 'for publishing', which removes template comments

### Patch Changes

- [#720](https://github.com/lblod/frontend-gelinkt-notuleren/pull/720) [`07b5d09`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/07b5d091959182fa06498cde6d0769767ab7f98c) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to version 24.0.0

## 5.28.1

### Patch Changes

- [#716](https://github.com/lblod/frontend-gelinkt-notuleren/pull/716) [`76d5a1c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/76d5a1cb6099a8fc081e6b61086811950c6d9ddf) Thanks [@piemonkey](https://github.com/piemonkey)! - Include fix for snippet buttons in certain situations

- [#721](https://github.com/lblod/frontend-gelinkt-notuleren/pull/721) [`a8f441d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a8f441d95c0cff4a89a58443284c54d0b4cd8be3) Thanks [@abeforgit](https://github.com/abeforgit)! - bump plugins to [23.0.0](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v23.0.0)

- [#713](https://github.com/lblod/frontend-gelinkt-notuleren/pull/713) [`c851cc2`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c851cc20930553430372c6f38b10840a8c32181d) Thanks [@abeforgit](https://github.com/abeforgit)! - Add polymorphic to all remaining relationships to meetings

## 5.28.0

### Minor Changes

- [#704](https://github.com/lblod/frontend-gelinkt-notuleren/pull/704) [`ecd4d94`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ecd4d94cb0e8ad52361da0b2fb2da505a22bf6bf) Thanks [@piemonkey](https://github.com/piemonkey)! - Update to v22.5.1 of plugins. Including:
  - Support for imported resources in snippets, both when editing and including them
  - Mandatee table improvements

## 5.27.3

### Patch Changes

- [#718](https://github.com/lblod/frontend-gelinkt-notuleren/pull/718) [`9635ec2`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9635ec27677ac432da7de8facf52b60e72dbcfb7) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix removal of empty lines on save, they are now maintained

## 5.28.0-next.0

### Minor Changes

- [#711](https://github.com/lblod/frontend-gelinkt-notuleren/pull/711) [`d3f4f25`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d3f4f255eace6a55f67122a2faba7fdc35d14a97) Thanks [@elpoelma](https://github.com/elpoelma)! - Add inital mandatee table config containing the different configurations/queries needed for the inauguration meeting

### Patch Changes

- [#712](https://github.com/lblod/frontend-gelinkt-notuleren/pull/712) [`6f7d82a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6f7d82a65d860be48cd9b2fbd5e17113c4c3974d) Thanks [@abeforgit](https://github.com/abeforgit)! - Recalculate structure numbers after snippet insert (plugin bump)

- [#713](https://github.com/lblod/frontend-gelinkt-notuleren/pull/713) [`2b73813`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2b7381393b711db4895b9ef83cf5a6c0898a2386) Thanks [@abeforgit](https://github.com/abeforgit)! - Add polymorphic to all remaining relationships to meetings

## 5.27.2

### Patch Changes

- [`a538d6e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a538d6ee6e1d6421617a380e494e2db28e49b0bc) Thanks [@elpoelma](https://github.com/elpoelma)! - When deleting a signature, and all signatures have been removed, ensure that the `deleted` status is set on the `fullNotulen` resource, not the `publicNotulen` resource

- [`a538d6e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a538d6ee6e1d6421617a380e494e2db28e49b0bc) Thanks [@elpoelma](https://github.com/elpoelma)! - Adjust rdfa-annotation stylesheets to also match full URIs instead of only prefixed ones

## 5.27.1

### Patch Changes

- [#709](https://github.com/lblod/frontend-gelinkt-notuleren/pull/709) [`64da6b7`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/64da6b7d783e3d04473ca6a435ba0e0d7dc15d28) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to version 22.4.1

## 5.27.0

### Minor Changes

- [#694](https://github.com/lblod/frontend-gelinkt-notuleren/pull/694) [`eb549e7`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/eb549e75f93e3fb02a840d84bf6d68808880b7a8) Thanks [@elpoelma](https://github.com/elpoelma)! - Addition of a generic `SimpleModal` component. This component is an extension of the `AuModal` component. It is less opinionated as the content can be completely configured (no predefined content).

- [#694](https://github.com/lblod/frontend-gelinkt-notuleren/pull/694) [`eb549e7`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/eb549e75f93e3fb02a840d84bf6d68808880b7a8) Thanks [@elpoelma](https://github.com/elpoelma)! - Addition of a basic meeting synchronization flow which allows users to synchronize an inauguration meeting with a configured LMB endpoint.

### Patch Changes

- [#694](https://github.com/lblod/frontend-gelinkt-notuleren/pull/694) [`324fdb5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/324fdb52e33e0d61572680ef947df5b794a97464) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version 10.3.0

## 5.26.0

### Minor Changes

- [#697](https://github.com/lblod/frontend-gelinkt-notuleren/pull/697) [`6127729`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6127729b9cac923835ccfed5750867173072016f) Thanks [@elpoelma](https://github.com/elpoelma)! - Add meeting details modal to inauguration-meeting creation flow

### Patch Changes

- [#708](https://github.com/lblod/frontend-gelinkt-notuleren/pull/708) [`00c342d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/00c342d84510d960123b958baaa4ac6e58604339) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to version 22.3.0

## 5.25.0

### Minor Changes

- [#702](https://github.com/lblod/frontend-gelinkt-notuleren/pull/702) [`389cb83`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/389cb83af84a70e0c3d745b3139ba15a83cc5436) Thanks [@elpoelma](https://github.com/elpoelma)! - (functionaris-selector) improve filter of functionaris query

- [#699](https://github.com/lblod/frontend-gelinkt-notuleren/pull/699) [`0042f62`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0042f62614dc2663d924eab495b70425ce456f8f) Thanks [@elpoelma](https://github.com/elpoelma)! - agendapoint editor: enable rdfa-aware `doc`, `heading` and `link` nodes

- [#699](https://github.com/lblod/frontend-gelinkt-notuleren/pull/699) [`2386e7e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2386e7e1782068b6d99eb47e57dcd04114a1a2b9) Thanks [@elpoelma](https://github.com/elpoelma)! - meeting intro/outro editors: enable rdfa-aware nodes

- [#699](https://github.com/lblod/frontend-gelinkt-notuleren/pull/699) [`fb19e47`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/fb19e47f19a9c6cedc06102c2a116617fb7e436a) Thanks [@elpoelma](https://github.com/elpoelma)! - regulatory-statement editor: enable rdfa-aware `link` nodes

- [#702](https://github.com/lblod/frontend-gelinkt-notuleren/pull/702) [`e500a25`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e500a25b46dd900fb268ca3c47fd39ab1c00d202) Thanks [@elpoelma](https://github.com/elpoelma)! - Improve filtering of possible-participants (meeting-form) query

- [#702](https://github.com/lblod/frontend-gelinkt-notuleren/pull/702) [`145f095`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/145f0958d060c3d6c6097b639755b994c0ad33ed) Thanks [@elpoelma](https://github.com/elpoelma)! - (mandataris-selector) improve filter of mandatee queries

- [#702](https://github.com/lblod/frontend-gelinkt-notuleren/pull/702) [`91ed23d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/91ed23d6e82f2e295770cbe0886644293dbe5fc6) Thanks [@elpoelma](https://github.com/elpoelma)! - (meeting-form) adjust possible-participants query to include additional relationships to avoid patchy load of mandatee-table

## 5.24.1

### Patch Changes

- [`f4dafaf`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f4dafaf93382a17f58687f4f1d1ad95c24f9494f) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to version 22.2.2

## 5.24.0

### Minor Changes

- [#703](https://github.com/lblod/frontend-gelinkt-notuleren/pull/703) [`5882b39`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5882b3999862df3a2baebd29d134873345b00110) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Add person variable

### Patch Changes

- [#705](https://github.com/lblod/frontend-gelinkt-notuleren/pull/705) [`c31bdea`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c31bdead835a8c0b630f074a4c0e7cc3e1787330) Thanks [@elpoelma](https://github.com/elpoelma)! - Drop the redundant `keyboardInstruction` setting of date-picker, as the date-picker now uses a table element, which screen readers already know how to handle.

## 5.23.0

### Minor Changes

- [`832d73d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/832d73dcfc2d6c92e786880500a5d698878c0c59) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Bump ember-rdfa-editor to 10.1.0

### Patch Changes

- [#700](https://github.com/lblod/frontend-gelinkt-notuleren/pull/700) [`a255765`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a255765b83c56b24297acb083935b93769ad37f5) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Don't make unnecesary history changes when updating regulatory statements inside agendapoints

## 5.22.0

### Minor Changes

- [#701](https://github.com/lblod/frontend-gelinkt-notuleren/pull/701) [`8730def`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/8730def66b22462f4c22f503d798407cd6ace278) Thanks [@lagartoverde](https://github.com/lagartoverde)! - BUmp plugins to 2.22.1

## 5.21.0

### Minor Changes

- [#667](https://github.com/lblod/frontend-gelinkt-notuleren/pull/667) [`74542c6`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/74542c614559541f83acc87f0d2d63a58aede5f3) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4693: Bump `@lblod/ember-rdfa-editor-lblod-plugins` to `19.2.0` and enable `LPDC` plugin

- [#696](https://github.com/lblod/frontend-gelinkt-notuleren/pull/696) [`0201665`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/02016653bade630d84a6c7bd94d831d823c47820) Thanks [@elpoelma](https://github.com/elpoelma)! - Remove seperate edit button for agenda items and make agenda item titles clickable

### Patch Changes

- [#698](https://github.com/lblod/frontend-gelinkt-notuleren/pull/698) [`6013e9f`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6013e9f21acd5c37c54798a5a059b6b2feede347) Thanks [@elpoelma](https://github.com/elpoelma)! - Exlude ember-leaflet assets from fingerprinting

- [#695](https://github.com/lblod/frontend-gelinkt-notuleren/pull/695) [`65a57f1`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/65a57f1577b4abeb112ae10bdb8000ca06638939) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version 10.0.3

- [#695](https://github.com/lblod/frontend-gelinkt-notuleren/pull/695) [`65a57f1`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/65a57f1577b4abeb112ae10bdb8000ca06638939) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to version 22.1.0

- [#693](https://github.com/lblod/frontend-gelinkt-notuleren/pull/693) [`c04e82f`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c04e82feb03b5138bb9e994544dda420bb3d181c) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix links in meeting sidebar

## 5.20.2

### Patch Changes

- [#692](https://github.com/lblod/frontend-gelinkt-notuleren/pull/692) [`830254a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/830254a092277112b96e940c61ec07b6e6ab40b1) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix meeting absentees not shown

- [`6b63c5f`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6b63c5f9f264337f76353ef3e9739c966d98b238) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix wrong date being shown on meeting overview page

- [#691](https://github.com/lblod/frontend-gelinkt-notuleren/pull/691) [`9c1f96d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9c1f96d1df543388ad23663ca2fc9594f910e132) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure snippets can be correctly inserted on the regulatory statement editor page

## 5.20.1

### Patch Changes

- [#690](https://github.com/lblod/frontend-gelinkt-notuleren/pull/690) [`14308b4`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/14308b401dea6bf3e067a91cf2b94c8e4b9c3d08) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version [10.0.1](https://github.com/lblod/ember-rdfa-editor/releases/tag/v10.0.1)
  Update `@lblod/ember-rdfa-editor-lblod-plugins` to version [22.0.2](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v22.0.2)

## 5.20.0

### Minor Changes

- [#683](https://github.com/lblod/frontend-gelinkt-notuleren/pull/683) [`0a37110`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0a37110fb41e58c2780cb5a2f1fd2fa32f0ca3a7) Thanks [@elpoelma](https://github.com/elpoelma)! - - Add basic support for consuming and using decision templates from the regulatory statement endpoint

  - Refactor `RegulatoryAttachmentsFetcher` to `TemplateFetcher`

- [#635](https://github.com/lblod/frontend-gelinkt-notuleren/pull/635) [`0a43cb3`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0a43cb3ef75fad4bb01ce56b09d3f70b05ea613f) Thanks [@elpoelma](https://github.com/elpoelma)! - Set-up basic creation-flow for inauguration meetings (installatievergadering) of a municipal council (gemeenteraad)

- [#688](https://github.com/lblod/frontend-gelinkt-notuleren/pull/688) [`6e3ed19`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6e3ed19dd5221ccd649b2f3ab4ee0a8a09472c3d) Thanks [@piemonkey](https://github.com/piemonkey)! - Update to lblod/ember-rdfa-editor and lblod/ember-rdfa-editor-lblod-plugins with updated dependency versions and update dependencies to match

- [`40e8403`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/40e84030f378437bc9536f6a1d970f61dd58bd8f) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to version 22.0.1

### Patch Changes

- [#679](https://github.com/lblod/frontend-gelinkt-notuleren/pull/679) [`d09c779`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/d09c77917f8d7db6897c55bf1dcfa295f4e2d1d5) Thanks [@piemonkey](https://github.com/piemonkey)! - Update version of ember-modifier and remove some deprecated code use

- [#685](https://github.com/lblod/frontend-gelinkt-notuleren/pull/685) [`f8ad946`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f8ad946710e36a3949c05ec66470d820e8a6532b) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4829: Design updates to meetings

- [`40e8403`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/40e84030f378437bc9536f6a1d970f61dd58bd8f) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version 10.0.0

## 5.19.4

### Patch Changes

- [#710](https://github.com/lblod/frontend-gelinkt-notuleren/pull/710) [`f46cc0d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f46cc0decba2c2f15f07609a4f41a6f2b64f4528) Thanks [@elpoelma](https://github.com/elpoelma)! - When deleting a signature, and all signatures have been removed, ensure that the `deleted` status is set on the `fullNotulen` resource, not the `publicNotulen` resource

## 5.19.3

### Patch Changes

- [#707](https://github.com/lblod/frontend-gelinkt-notuleren/pull/707) [`b260950`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b260950f617e4693f9768df49448235acdac1a8a) Thanks [@elpoelma](https://github.com/elpoelma)! - Adjust rdfa-annotation stylesheets to also match full URIs instead of only prefixed ones

- [#706](https://github.com/lblod/frontend-gelinkt-notuleren/pull/706) [`c01e81b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c01e81bc45589b8fe76604d407562d1544462a9f) Thanks [@elpoelma](https://github.com/elpoelma)! - Update to editor-plugin 19.3.2 hotfix which contains fixes for styles of annotated content

## 5.19.2

### Patch Changes

- [`7544ef6`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7544ef6a502f0bb612be7b36c869d986cf3756a0) Thanks [@elpoelma](https://github.com/elpoelma)! - Exlude ember-leaflet assets from fingerprinting

## 5.19.1

### Patch Changes

- [#682](https://github.com/lblod/frontend-gelinkt-notuleren/pull/682) [`f92fb55`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f92fb55ab68d98b10b631066872285aed3b0be40) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4853: Seach and sort templates alphabetically

- [#681](https://github.com/lblod/frontend-gelinkt-notuleren/pull/681) [`27a92bd`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/27a92bdd6b324d7ca34fc8c3ff8f68525c4d4dd9) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fixed copy agendapunt description button

## 5.19.0

### Minor Changes

- [#677](https://github.com/lblod/frontend-gelinkt-notuleren/pull/677) [`5a142bc`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5a142bc4db557949bae838d569cf012732be121f) Thanks [@piemonkey](https://github.com/piemonkey)! - Switch to new location-plugin for addresses, including functionality to choose geographic locations from a map

- [#677](https://github.com/lblod/frontend-gelinkt-notuleren/pull/677) [`0166bf1`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0166bf15fed0944f26ccc25f7f0b6511b08f57a3) Thanks [@piemonkey](https://github.com/piemonkey)! - Update to latest @lblod/ember-rdfa-editor-lblod-plugins v19.3.0

### Patch Changes

- [#678](https://github.com/lblod/frontend-gelinkt-notuleren/pull/678) [`dabd46e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/dabd46ee6bb276a7814a554b9851247239b2ad1f) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4820: Bump editor and enable copy/pasting variable nodes correctly

- [#676](https://github.com/lblod/frontend-gelinkt-notuleren/pull/676) [`57658bd`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/57658bdc4c0a03ddff0720803e89ea1a39d099d1) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix bug where selection in link url text was not visible

## 5.18.1

### Patch Changes

- [#675](https://github.com/lblod/frontend-gelinkt-notuleren/pull/675) [`5f0f9eb`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5f0f9ebb191003e5aa691e94e72d04fce92fbb5d) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure that exiting dialog does not show up when saving and exiting the intro/outro of a meeting

- [#674](https://github.com/lblod/frontend-gelinkt-notuleren/pull/674) [`2915b7a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2915b7a11f5c7fcc7dbe494be5b07ca26570aa90) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix rendering of documents on revisions page

- [#672](https://github.com/lblod/frontend-gelinkt-notuleren/pull/672) [`eaa66f6`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/eaa66f66b91addca997a4a469164ec0131e2cdf9) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4825: Show "Insert snippet" when required

- [#669](https://github.com/lblod/frontend-gelinkt-notuleren/pull/669) [`c12b953`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c12b95322424dba1f7a2ab9d5b6f7b3f92e9a7f1) Thanks [@piemonkey](https://github.com/piemonkey)! - Correctly tag release builds as latest

## 5.18.0

### Minor Changes

- [`e24b3ad`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e24b3adb110c405dbbf2e212238c8250acc5ec9f) Thanks [@piemonkey](https://github.com/piemonkey)! - Update @lblod/ember-rdfa-editor to 9.10.0 and @lblod/ember-rdfa-editor-lblod-plugins to 19.2.0

### Patch Changes

- [#664](https://github.com/lblod/frontend-gelinkt-notuleren/pull/664) [`6e13b96`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/6e13b96760db62e52d025093a0f09adb4dde8521) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Remove wrongly placed text block in the free text section title

- [#663](https://github.com/lblod/frontend-gelinkt-notuleren/pull/663) [`8d5cf63`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/8d5cf63ae9fcac55dec258c6c2cee1a11d7f2ccb) Thanks [@lagartoverde](https://github.com/lagartoverde)! - Fixed switch labels

## 5.17.2

### Patch Changes

- [`7b5c4fe0`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7b5c4fe050076e71bbd3911a3d4b22646f90bbe8) Thanks [@abeforgit](https://github.com/abeforgit)! - Add back structure styling

## 5.17.1

### Patch Changes

- [#659](https://github.com/lblod/frontend-gelinkt-notuleren/pull/659) [`0c7efa22`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/0c7efa227b8c8e5f4b7272276b116512cdf07993) Thanks [@dkozickis](https://github.com/dkozickis)! - Apply Prettier to the codebase

- [#662](https://github.com/lblod/frontend-gelinkt-notuleren/pull/662) [`ac651c6c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ac651c6cf3b917dafc11d63235cb1c813f5ed905) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4692: Bump `ember-rdfa-editor-lblod-plugins` and enable `BesluitTopicPlugin`

## 5.17.0

### Minor Changes

- [#661](https://github.com/lblod/frontend-gelinkt-notuleren/pull/661) [`e8c3b562`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e8c3b56223186e22d0fd2818d34e3d0dc4e76112) Thanks [@piemonkey](https://github.com/piemonkey)! - Add support for snippet placeholder nodes in regulatory statements

### Patch Changes

- [#657](https://github.com/lblod/frontend-gelinkt-notuleren/pull/657) [`53d920b3`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/53d920b3e78c95b9d021a43a42e185e415367cd6) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4827: Remove RDFA Tools from RDFA Editor

- [#658](https://github.com/lblod/frontend-gelinkt-notuleren/pull/658) [`400d5bfc`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/400d5bfcf613bee364f76a7a01576763f041d47c) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4825: Fix fetching snippets from RB

## 5.16.0

### Minor Changes

- [#624](https://github.com/lblod/frontend-gelinkt-notuleren/pull/624) [`3fdce6a3`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/3fdce6a36e74658d3ccc486e026ab882431abdb8) Thanks [@piemonkey](https://github.com/piemonkey)! - Add hidden support for editing and advanced annotation of RDFa in the editor

### Patch Changes

- [#654](https://github.com/lblod/frontend-gelinkt-notuleren/pull/654) [`7538e800`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7538e8004e869d35da5fa16f1e6991c2fdd623d9) Thanks [@piemonkey](https://github.com/piemonkey)! - Remove duplication of supported locales passed to ember-intl

- [#624](https://github.com/lblod/frontend-gelinkt-notuleren/pull/624) [`f3735717`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f3735717c0bcf1250d5efb289b4135d027f35515) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix some deprecation warnings from appuniversum

- [#654](https://github.com/lblod/frontend-gelinkt-notuleren/pull/654) [`4ff629ce`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4ff629ce18de37cb340da051bcb43040092aa448) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix CI set-up to correctly fail on test failures and update package-lock to match package.json

- [#624](https://github.com/lblod/frontend-gelinkt-notuleren/pull/624) [`ef39fe32`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ef39fe32c1a8852b3601cc9d282cce1095344ab7) Thanks [@piemonkey](https://github.com/piemonkey)! - Improve editor load times by running some promises in parallel instead of series

## 5.15.1

### Patch Changes

- [#652](https://github.com/lblod/frontend-gelinkt-notuleren/pull/652) [`ff9f7bad`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ff9f7badbc085f557d8e8fb020d9a774c2b8dee5) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to 17.1.1

- [`4ba4d36e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4ba4d36ef0e1694f21312fa833eabd371fd2977e) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version 9.7.1

## 5.15.0

### Minor Changes

- [#651](https://github.com/lblod/frontend-gelinkt-notuleren/pull/651) [`9419f783`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/9419f783fb6aa7d8a8b6d1ec3d3f8df33619fc60) Thanks [@elpoelma](https://github.com/elpoelma)! - Enable support for hierarchical lists

### Patch Changes

- [#651](https://github.com/lblod/frontend-gelinkt-notuleren/pull/651) [`fe2ab595`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/fe2ab595444c113bd2ff612145b7d6fed7389664) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to version 9.7.0

## 5.14.0

### Minor Changes

- [#645](https://github.com/lblod/frontend-gelinkt-notuleren/pull/645) [`c522af9a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c522af9a8fa38ce5210b1fc99464334f4b82ffa4) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4800: Bump `@appuniversum/ember-appuniversum` to `3.4.1`

  - Bump `@appuniversum/ember-appuniversum` to `3.4.1`

    - Update breaking changes, mainly removing two-way binding from `AuTextarea` and `AuInput` components.
    - Change how `appuniversum` SCSS is imported in the app.
    - Add a key to `AuDatePicker` localisation.

  - Bump `@lblod/ember-rdfa-editor-lblod-plugins` to `17.0.0`
  - Bump `@lblod/ember-environment-banner` to `0.5.0`

- [#646](https://github.com/lblod/frontend-gelinkt-notuleren/pull/646) [`906a1363`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/906a136348e2c074f8c8268aeabb4470825d73ee) Thanks [@dkozickis](https://github.com/dkozickis)! - Bump `ember-rdfa-editor-lblod-plugins` to `17.1.0` to get snippet changes:

  ##### GN-4811: Only show the titles of the snippets

  In the snippet insert modal: only show the titles of the snippets

  #### GN-4816: Add sorting for snippet lists

  - Use AuDataTable
  - Add sorting for snippet lists

## 5.13.1

### Patch Changes

- [#644](https://github.com/lblod/frontend-gelinkt-notuleren/pull/644) [`862e5584`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/862e5584a501db9b05ccd45519d5228149d0e261) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4808: Fix language detection for users that are coming to GN for the first time

## 5.13.0

### Minor Changes

- [#643](https://github.com/lblod/frontend-gelinkt-notuleren/pull/643) [`968dc25b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/968dc25b9bcbde828e6e0316f55d38b9899dabff) Thanks [@piemonkey](https://github.com/piemonkey)! - Add initial version of worship service plugin

### Patch Changes

- [#641](https://github.com/lblod/frontend-gelinkt-notuleren/pull/641) [`8b3fab9a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/8b3fab9a9a01b0c919871fd0f57d13d2dee12e03) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4772: Fix supported language detection

- [#634](https://github.com/lblod/frontend-gelinkt-notuleren/pull/634) [`b2649e7a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/b2649e7af8c21160c93666bbd07d8770b4c9d334) Thanks [@elpoelma](https://github.com/elpoelma)! - (internal) Drop requirement to pass template to its own loadBody method

- [#636](https://github.com/lblod/frontend-gelinkt-notuleren/pull/636) [`18e735e7`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/18e735e733e6f007ae37ab3c1dc4b292069593d6) Thanks [@elpoelma](https://github.com/elpoelma)! - Update editor to 9.6.1 and plugins to 16.3.0

- [#643](https://github.com/lblod/frontend-gelinkt-notuleren/pull/643) [`61a90dda`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/61a90ddad970b8e52b919caac58565f4b01422e1) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix some deprecation warnings from appuniversum

- [#638](https://github.com/lblod/frontend-gelinkt-notuleren/pull/638) [`cb2efe03`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/cb2efe030c1ebe7f353f9f03337dc494d168a129) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4771: Regulatory statements not showing in agendapoint

  Fix `emberNodeConfig` definition for `regulatory-statement-view` to use `component` instead of old `componentPath`.

- [#640](https://github.com/lblod/frontend-gelinkt-notuleren/pull/640) [`5aa056ec`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5aa056ec79ccc8ce1a9b7f8184e9ce136ea35b04) Thanks [@piemonkey](https://github.com/piemonkey)! - Add support for signed-resources and published-resources which have their content in files instead of directly as text

- [#640](https://github.com/lblod/frontend-gelinkt-notuleren/pull/640) [`ac1b6763`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ac1b6763f0dcebc78e8389b3dec75b6a71c891a3) Thanks [@piemonkey](https://github.com/piemonkey)! - Fix some bugs around versioned-notulen with content stored as files

- [#643](https://github.com/lblod/frontend-gelinkt-notuleren/pull/643) [`a1c1b584`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/a1c1b584e600ee177054c496fbd3d31dba1c4cc1) Thanks [@piemonkey](https://github.com/piemonkey)! - Improve editor load times by running some promises in parallel instead of series

## 5.12.2

### Patch Changes

- [#633](https://github.com/lblod/frontend-gelinkt-notuleren/pull/633) [`7198b50c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7198b50c5fca9e7889c5d0ac56967dd3719bcc46) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor to v9.5.1

## 5.12.1

### Patch Changes

- [`79cddac2`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/79cddac2dcd8156f2929c965a5e3b572ab20eae4) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor to 9.5.0

## 5.12.0

### Minor Changes

- [#626](https://github.com/lblod/frontend-gelinkt-notuleren/pull/626) [`088527e2`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/088527e241defa9c6badc4a3e137951f7bd830ab) Thanks [@nvdk](https://github.com/nvdk)! - support notulen publications as files

- [#621](https://github.com/lblod/frontend-gelinkt-notuleren/pull/621) [`13028253`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/1302825302e52078690acfd07492d32a82e53ed3) Thanks [@elpoelma](https://github.com/elpoelma)! - Improve browser language detection and set a fallback of `nl-BE`

- [#627](https://github.com/lblod/frontend-gelinkt-notuleren/pull/627) [`f98250bb`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f98250bb867f0b7eac428551578688f1255bfe42) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4660: Percentage resize for tables instead of absolute pixels

### Patch Changes

- [#627](https://github.com/lblod/frontend-gelinkt-notuleren/pull/627) [`f98250bb`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f98250bb867f0b7eac428551578688f1255bfe42) Thanks [@dkozickis](https://github.com/dkozickis)! - Update `@lblod/ember-rdfa-editor` to 9.2.0

- [#628](https://github.com/lblod/frontend-gelinkt-notuleren/pull/628) [`84592be5`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/84592be54a1043e3dc10b390405474f91288deaf) Thanks [@elpoelma](https://github.com/elpoelma)! - Add null/undefined checks to `behandeling-van-agendapunt` component to prevent errors

## 5.11.0

### Minor Changes

- [#623](https://github.com/lblod/frontend-gelinkt-notuleren/pull/623) [`73cb66f4`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/73cb66f4ce61ad7d8039b9244966dd2c35015bc6) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor to 9.1.0 and plugins to 16.1.0

  fixes [4657](https://binnenland.atlassian.net/browse/GN-4657)
  fixes [4652](https://binnenland.atlassian.net/browse/GN-4652)

## 5.10.3

### Patch Changes

- [#619](https://github.com/lblod/frontend-gelinkt-notuleren/pull/619) [`1c156717`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/1c156717e4b4241bf3ef0f45b0100c0cd0a52ec0) Thanks [@elpoelma](https://github.com/elpoelma)! - Downgrade `ember-intl` to 5.7.2

- [#619](https://github.com/lblod/frontend-gelinkt-notuleren/pull/619) [`1c156717`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/1c156717e4b4241bf3ef0f45b0100c0cd0a52ec0) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to 9.0.2
  Update `@lblod/ember-rdfa-editor-lblod-plugins` to 16.0.1

## 5.10.2

### Patch Changes

- [#618](https://github.com/lblod/frontend-gelinkt-notuleren/pull/618) [`f3940bba`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f3940bbab8194392cd796de3a4b707be65cbbfa7) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@appuniversum/ember-appuniversum` to 2.15.0

- [#618](https://github.com/lblod/frontend-gelinkt-notuleren/pull/618) [`f3940bba`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f3940bbab8194392cd796de3a4b707be65cbbfa7) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to 9.0.0

- [#618](https://github.com/lblod/frontend-gelinkt-notuleren/pull/618) [`f3940bba`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f3940bbab8194392cd796de3a4b707be65cbbfa7) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `ember-intl` to 6.1.0

- [#618](https://github.com/lblod/frontend-gelinkt-notuleren/pull/618) [`f3940bba`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f3940bbab8194392cd796de3a4b707be65cbbfa7) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to 16.0.0

## 5.10.1

### Patch Changes

- [#614](https://github.com/lblod/frontend-gelinkt-notuleren/pull/614) [`7ecf0c67`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7ecf0c672a1884ec4d6c5157248ae8036cac2c43) Thanks [@piemonkey](https://github.com/piemonkey)! - Correctly track the saved state so we only ask to save changes when changes have been made

- [#616](https://github.com/lblod/frontend-gelinkt-notuleren/pull/616) [`fb96524b`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/fb96524bbc83920ccfc800e2d819bbe4d9b295ca) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-plugins` to 15.2.2

- [#616](https://github.com/lblod/frontend-gelinkt-notuleren/pull/616) [`5836bdb9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5836bdb964fe19e70cc64b93ade73fd320ce99cb) Thanks [@elpoelma](https://github.com/elpoelma)! - Update editor to 8.2.0

- [#615](https://github.com/lblod/frontend-gelinkt-notuleren/pull/615) [`ccb58a99`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/ccb58a99049b144656fc3c5a83f51f704e06a905) Thanks [@piemonkey](https://github.com/piemonkey)! - Correctly translate 'insert' in the sidebar

## 5.10.0

### Minor Changes

- [#610](https://github.com/lblod/frontend-gelinkt-notuleren/pull/610) [`e4742aae`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e4742aae2c24e8977c0f00c105dfb816a8203878) Thanks [@elpoelma](https://github.com/elpoelma)! - Disable space-invisible in order to prevent slowdowns

- [#611](https://github.com/lblod/frontend-gelinkt-notuleren/pull/611) [`4ba94b92`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4ba94b9239dc06eeb2c35384648567879d05f944) Thanks [@dkozickis](https://github.com/dkozickis)! - Bump editor dependencies

  - Bump `@lblod/ember-rdfa-editor` to `^8.0.2`
  - Bump `@lblod/ember-rdfa-editor-lblod-plugins` to `^15.2.1`
  - Enable `Alignment` plugin
  - Enable column sizing for tables

## 5.9.3

### Patch Changes

- [`af202b99`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/af202b996bc3d79f0c1c2c43fb122ca04e8e7558) Thanks [@abeforgit](https://github.com/abeforgit)! - correctly deal with the 2 types of versionedNotulen

  - correctly show signatures even after document is published
  - correctly show the full document when signing even if notulen is already published with some parts marked private (you always sign the whole document)
    -> the page was showing the wrong document in the signing modal in
    niche cases before, leading users to sign a different document than what they
    were looking at

## 5.9.2

### Patch Changes

- [#607](https://github.com/lblod/frontend-gelinkt-notuleren/pull/607) [`87a9de7c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/87a9de7c913716a07276a010eeeb5c5c497ee047) Thanks [@elpoelma](https://github.com/elpoelma)! - Update regex in `isLoadingRoute` function to take underscore syntax into account

- [`f29003c0`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/f29003c0536a71b646240a1369aee75eb92087b9) Thanks [@abeforgit](https://github.com/abeforgit)! - Bump editor to [v7.0.1](https://github.com/lblod/ember-rdfa-editor/releases/tag/v7.0.1) and plugins to [v15.1.0](https://github.com/lblod/ember-rdfa-editor-lblod-plugins/releases/tag/v15.1.0)

- [#601](https://github.com/lblod/frontend-gelinkt-notuleren/pull/601) [`072fb6cc`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/072fb6cc8c9e9a10b6e1a5bd9f30a4af4565e40f) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor-lblod-plugins` to 15.0.0

- [#608](https://github.com/lblod/frontend-gelinkt-notuleren/pull/608) [`7b506a9f`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7b506a9fa1e47bf4f807faa2bd39197e504fd28c) Thanks [@elpoelma](https://github.com/elpoelma)! - Fix import paths of variable-date plugin in `zitting-text-document-container` component

## 5.9.1

### Patch Changes

- [#606](https://github.com/lblod/frontend-gelinkt-notuleren/pull/606) [`76e04611`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/76e046113ed1b9310ae7722d499649e2f4477f3e) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-XXX: Fix agendapoint/regulatory attachment template "reload"

## 5.9.0

### Minor Changes

- [#586](https://github.com/lblod/frontend-gelinkt-notuleren/pull/586) [`be7b65ad`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/be7b65adc3852fa209992f175fdc28c046eb3e18) Thanks [@piemonkey](https://github.com/piemonkey)! - Add support for regulatory statement templates with repeated entity uris

- [#590](https://github.com/lblod/frontend-gelinkt-notuleren/pull/590) [`c6c5bca9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c6c5bca9f7f267fce4a0efd5fad3253f7fff784e) Thanks [@elpoelma](https://github.com/elpoelma)! - Update ember-source to 4.12.0

- [#590](https://github.com/lblod/frontend-gelinkt-notuleren/pull/590) [`c6c5bca9`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/c6c5bca9f7f267fce4a0efd5fad3253f7fff784e) Thanks [@elpoelma](https://github.com/elpoelma)! - Update ember-data to 4.12.0

### Patch Changes

- [`5e487994`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/5e4879946f91faa0f9b189e1eb59d1974dedf6eb) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to 6.4.0

- [#591](https://github.com/lblod/frontend-gelinkt-notuleren/pull/591) [`7fbdaa2f`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7fbdaa2f41db0b64951147b983a153fc4addbf3e) Thanks [@elpoelma](https://github.com/elpoelma)! - Ensure editor is only initalized after correct prefix attribute has been set

## 5.8.0

### Minor Changes

- [#581](https://github.com/lblod/frontend-gelinkt-notuleren/pull/581) [`229897a8`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/229897a805943e3df4c3da7fa4529a8df8809890) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4528: Fix issues reported by `dependency-lint`, require `dependency-lint` CI job to pass

- [#582](https://github.com/lblod/frontend-gelinkt-notuleren/pull/582) [`7492c976`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7492c9765f11c402843bfd47198c2ccef96e711a) Thanks [@x-m-el](https://github.com/x-m-el)! - - automatically save the document title if clicking outside of the title input box
  - Do not allow empty document titles
  - saving a document will also save its title
  - the "saved" pill will only show up if something is actually saved

### Patch Changes

- [#585](https://github.com/lblod/frontend-gelinkt-notuleren/pull/585) [`e41a0233`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/e41a0233b75b2363c7474e539264403c3b350959) Thanks [@x-m-el](https://github.com/x-m-el)! - Use the say-content style for any treatment content, like rendering sub/superscripts correctly

- [#587](https://github.com/lblod/frontend-gelinkt-notuleren/pull/587) [`4551896e`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/4551896edf2ff89e0cc007bc6bcce632d56e5e65) Thanks [@elpoelma](https://github.com/elpoelma)! - Update `@lblod/ember-rdfa-editor` to 6.2.0

- [#583](https://github.com/lblod/frontend-gelinkt-notuleren/pull/583) [`817f18d3`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/817f18d32b6e13996a9ebbd27963746078010bb0) Thanks [@piemonkey](https://github.com/piemonkey)! - Pass standard templates into standard template plugin instead of it loading them itself

## 5.7.0

### Minor Changes

- [#579](https://github.com/lblod/frontend-gelinkt-notuleren/pull/579) [`2d05401d`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2d05401de753956e2f293e9e9d906177ab9f67b1) Thanks [@dkozickis](https://github.com/dkozickis)! - GN-4266: Reference published decisions

### Patch Changes

- [#579](https://github.com/lblod/frontend-gelinkt-notuleren/pull/579) [`71d1bc03`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/71d1bc035f28e16e8ece28c1216887e54e067e91) Thanks [@dkozickis](https://github.com/dkozickis)! - Downgrade `ember-modifier` version to v3

- [#571](https://github.com/lblod/frontend-gelinkt-notuleren/pull/571) [`99a38636`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/99a386360063929fda668e19fa71282da15d5582) Thanks [@elpoelma](https://github.com/elpoelma)! - Move to changesets for changelog management

- [#576](https://github.com/lblod/frontend-gelinkt-notuleren/pull/576) [`2c26716a`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/2c26716a55a0192059c46d1e0bc0a07a1ce1a79b) Thanks [@elpoelma](https://github.com/elpoelma)! - Only prefill address municipality if logged in user is part of a municipality/OCMW

- [#579](https://github.com/lblod/frontend-gelinkt-notuleren/pull/579) [`71d1bc03`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/71d1bc035f28e16e8ece28c1216887e54e067e91) Thanks [@dkozickis](https://github.com/dkozickis)! - Bump `"@lblod/ember-rdfa-editor-lblod-plugins`

- [#580](https://github.com/lblod/frontend-gelinkt-notuleren/pull/580) [`7b410e9c`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/7b410e9c997a2cae737dd7a9ff2ebe26f9589975) Thanks [@abeforgit](https://github.com/abeforgit)! - bump editor and plugins to 6.1.0 and 13.0.0

- [#579](https://github.com/lblod/frontend-gelinkt-notuleren/pull/579) [`71d1bc03`](https://github.com/lblod/frontend-gelinkt-notuleren/commit/71d1bc035f28e16e8ece28c1216887e54e067e91) Thanks [@dkozickis](https://github.com/dkozickis)! - Bump `@lblod/ember-rdfa-editor`

## 5.6.1 (2023-09-08)

#### :bug: Bug Fix

- [#564](https://github.com/lblod/frontend-gelinkt-notuleren/pull/564) GN-4430: Don't allow editing agendapoint participants if votings are present ([@x-m-el](https://github.com/x-m-el))

#### :house: Internal

- [#570](https://github.com/lblod/frontend-gelinkt-notuleren/pull/570) build(deps-dev): bump ember-truth-helpers from 3.1.1 to 4.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#569](https://github.com/lblod/frontend-gelinkt-notuleren/pull/569) build(deps-dev): bump @appuniversum/ember-appuniversum from 2.11.0 to 2.12.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#565](https://github.com/lblod/frontend-gelinkt-notuleren/pull/565) build(deps-dev): bump sass from 1.64.2 to 1.66.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#567](https://github.com/lblod/frontend-gelinkt-notuleren/pull/567) build(deps-dev): bump webpack from 5.88.0 to 5.88.2 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- [@x-m-el](https://github.com/x-m-el)

## 5.6.0 (2023-08-29)

#### :rocket: Enhancement

- [#563](https://github.com/lblod/frontend-gelinkt-notuleren/pull/563) feat(deps): update editor and plugins ([@abeforgit](https://github.com/abeforgit))
- [#558](https://github.com/lblod/frontend-gelinkt-notuleren/pull/558) GN-4472: Optimize loading of meeting page ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#562](https://github.com/lblod/frontend-gelinkt-notuleren/pull/562) build(deps-dev): bump ember-concurrency from 2.3.7 to 3.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#557](https://github.com/lblod/frontend-gelinkt-notuleren/pull/557) build(deps-dev): bump ember-template-lint from 5.10.1 to 5.11.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#561](https://github.com/lblod/frontend-gelinkt-notuleren/pull/561) build(deps-dev): bump eslint-plugin-ember from 11.9.0 to 11.11.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#560](https://github.com/lblod/frontend-gelinkt-notuleren/pull/560) build(deps-dev): bump prettier from 3.0.1 to 3.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#556](https://github.com/lblod/frontend-gelinkt-notuleren/pull/556) build(deps): bump ember-resources from 6.3.1 to 6.4.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 5.5.0 (2023-08-23)

#### :rocket: Enhancement

- [#545](https://github.com/lblod/frontend-gelinkt-notuleren/pull/545) GN-4441: Hide template comments via CSS in all previews ([@x-m-el](https://github.com/x-m-el))
- [#552](https://github.com/lblod/frontend-gelinkt-notuleren/pull/552) GN-4264: enable template comments in GN ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#554](https://github.com/lblod/frontend-gelinkt-notuleren/pull/554) build(deps-dev): bump eslint-config-prettier from 8.8.0 to 9.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#555](https://github.com/lblod/frontend-gelinkt-notuleren/pull/555) build(deps-dev): bump release-it from 16.1.3 to 16.1.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#549](https://github.com/lblod/frontend-gelinkt-notuleren/pull/549) build(deps-dev): bump prettier from 2.8.8 to 3.0.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#550](https://github.com/lblod/frontend-gelinkt-notuleren/pull/550) build(deps-dev): bump sass from 1.64.1 to 1.64.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#548](https://github.com/lblod/frontend-gelinkt-notuleren/pull/548) build(deps-dev): bump eslint-plugin-qunit from 7.3.4 to 8.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#533](https://github.com/lblod/frontend-gelinkt-notuleren/pull/533) build(deps-dev): bump ember-data-resources from 4.0.4 to 5.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#540](https://github.com/lblod/frontend-gelinkt-notuleren/pull/540) build(deps): bump ember-resources from 6.2.1 to 6.3.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#546](https://github.com/lblod/frontend-gelinkt-notuleren/pull/546) build(deps-dev): bump @appuniversum/ember-appuniversum from 2.7.0 to 2.11.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- [@x-m-el](https://github.com/x-m-el)

## 5.4.3 (2023-08-02)

#### :house: Internal

- [#542](https://github.com/lblod/frontend-gelinkt-notuleren/pull/542) Update editor plugins to 8.4.2 ([@elpoelma](https://github.com/elpoelma))
- [#539](https://github.com/lblod/frontend-gelinkt-notuleren/pull/539) build(deps-dev): bump eslint from 8.42.0 to 8.46.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#536](https://github.com/lblod/frontend-gelinkt-notuleren/pull/536) build(deps-dev): bump sass from 1.62.1 to 1.64.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#537](https://github.com/lblod/frontend-gelinkt-notuleren/pull/537) build(deps-dev): bump release-it from 15.11.0 to 16.1.3 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#532](https://github.com/lblod/frontend-gelinkt-notuleren/pull/532) build(deps-dev): bump ember-cli-app-version from 5.0.0 to 6.0.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#535](https://github.com/lblod/frontend-gelinkt-notuleren/pull/535) build(deps-dev): bump word-wrap from 1.2.3 to 1.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#531](https://github.com/lblod/frontend-gelinkt-notuleren/pull/531) build(deps-dev): bump @babel/eslint-parser from 7.22.5 to 7.22.9 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#534](https://github.com/lblod/frontend-gelinkt-notuleren/pull/534) build(deps-dev): bump @release-it-plugins/lerna-changelog from 5.0.0 to 6.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 5.4.2 (2023-07-13)

#### :bug: Bug Fix

- [#530](https://github.com/lblod/frontend-gelinkt-notuleren/pull/530) GN-4427: fix old signatures and publications not being picked up ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#528](https://github.com/lblod/frontend-gelinkt-notuleren/pull/528) build(deps): bump ember-resources from 6.1.1 to 6.2.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#529](https://github.com/lblod/frontend-gelinkt-notuleren/pull/529) build(deps): bump semver from 5.7.1 to 5.7.2 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 5.4.1 (2023-07-11)

#### :bug: Bug Fix

- [#527](https://github.com/lblod/frontend-gelinkt-notuleren/pull/527) GN-4372: fix pagination of extracts publish view ([@abeforgit](https://github.com/abeforgit))

#### Committers: 2

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- [@x-m-el](https://github.com/x-m-el)

## 5.4.0 (2023-07-06)

#### :bug: Bug Fix

- [#520](https://github.com/lblod/frontend-gelinkt-notuleren/pull/520) GN-4416: add document title config (and bump editor v3.10.0 and plugins v8.4.0) ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 5.3.0 (2023-07-06)

#### :rocket: Enhancement

- [#502](https://github.com/lblod/frontend-gelinkt-notuleren/pull/502) GN-4200: Implement new TOC scrolling functionality ([@lagartoverde](https://github.com/lagartoverde))
- [#519](https://github.com/lblod/frontend-gelinkt-notuleren/pull/519) GN-4406: add support for root level articles to regulatory statement documents ([@elpoelma](https://github.com/elpoelma))
- [#509](https://github.com/lblod/frontend-gelinkt-notuleren/pull/509) GN-4358: addition of a document-type filter to the publication actions page ([@elpoelma](https://github.com/elpoelma))
- [#512](https://github.com/lblod/frontend-gelinkt-notuleren/pull/512) GN-4384: Convert deleted text in publication actions to a pill ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#514](https://github.com/lblod/frontend-gelinkt-notuleren/pull/514) build(deps-dev): bump @babel/plugin-proposal-decorators from 7.22.3 to 7.22.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#516](https://github.com/lblod/frontend-gelinkt-notuleren/pull/516) build(deps-dev): bump ember-cli-dependency-checker from 3.3.1 to 3.3.2 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#518](https://github.com/lblod/frontend-gelinkt-notuleren/pull/518) build(deps-dev): bump eslint-plugin-ember from 11.8.0 to 11.9.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#506](https://github.com/lblod/frontend-gelinkt-notuleren/pull/506) build(deps-dev): bump ember-modifier from 3.2.7 to 4.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3

- Deniss Kozickis ([@dkozickis](https://github.com/dkozickis))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 5.2.1 (2023-06-28)

#### :rocket: Enhancement

- [#503](https://github.com/lblod/frontend-gelinkt-notuleren/pull/503) Make design of publication-actions page consistent with designs of other publication pages ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#511](https://github.com/lblod/frontend-gelinkt-notuleren/pull/511) GN-4403: use correct config for variables ([@abeforgit](https://github.com/abeforgit))
- [#499](https://github.com/lblod/frontend-gelinkt-notuleren/pull/499) GN-4362 fix signatures disappearing after publishing ([@abeforgit](https://github.com/abeforgit))
- [#510](https://github.com/lblod/frontend-gelinkt-notuleren/pull/510) fix translation issues on publication actions page ([@elpoelma](https://github.com/elpoelma))
- [#496](https://github.com/lblod/frontend-gelinkt-notuleren/pull/496) GN-4359: improve publish page translations ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#507](https://github.com/lblod/frontend-gelinkt-notuleren/pull/507) build(deps-dev): bump ember-plausible from 0.1.1 to 0.2.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#508](https://github.com/lblod/frontend-gelinkt-notuleren/pull/508) build(deps-dev): bump webpack from 5.87.0 to 5.88.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 5.2.0 (2023-06-22)

#### :rocket: Enhancement

- [#493](https://github.com/lblod/frontend-gelinkt-notuleren/pull/493) Hide hash on signed resource ([@lagartoverde](https://github.com/lagartoverde))
- [#494](https://github.com/lblod/frontend-gelinkt-notuleren/pull/494) Place the date on the right of the signer ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#498](https://github.com/lblod/frontend-gelinkt-notuleren/pull/498) Fix - Add publication action when deleting signature of document ([@x-m-el](https://github.com/x-m-el))

#### :house: Internal

- [#501](https://github.com/lblod/frontend-gelinkt-notuleren/pull/501) Update `@lblod/ember-rdfa-editor` to 3.10.0 and `@lblod/ember-rdfa-editor-lblod-plugins` to 8.1.0 ([@elpoelma](https://github.com/elpoelma))
- [#491](https://github.com/lblod/frontend-gelinkt-notuleren/pull/491) build(deps-dev): bump ember-resolver from 10.1.0 to 10.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#490](https://github.com/lblod/frontend-gelinkt-notuleren/pull/490) build(deps-dev): bump @ember/render-modifiers from 2.0.5 to 2.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#488](https://github.com/lblod/frontend-gelinkt-notuleren/pull/488) build(deps-dev): bump release-it from 15.10.3 to 15.11.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#492](https://github.com/lblod/frontend-gelinkt-notuleren/pull/492) build(deps-dev): bump webpack from 5.85.0 to 5.87.0 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 4

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Jan-Pieter Baert ([@Jan-PieterBaert](https://github.com/Jan-PieterBaert))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- [@x-m-el](https://github.com/x-m-el)

## 5.1.0 (2023-06-18)

#### :bug: Bug Fix

- [#475](https://github.com/lblod/frontend-gelinkt-notuleren/pull/475) Fix agendapoint title saving ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#487](https://github.com/lblod/frontend-gelinkt-notuleren/pull/487) update ember-rdfa-editor-lblod-plugins to 8.0.1 ([@lagartoverde](https://github.com/lagartoverde))
- [#478](https://github.com/lblod/frontend-gelinkt-notuleren/pull/478) build(deps-dev): bump tracked-toolbox from 1.3.0 to 2.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#486](https://github.com/lblod/frontend-gelinkt-notuleren/pull/486) Bump editor to 3.8.1 and editor-plugins to 7.2.0 ([@elpoelma](https://github.com/elpoelma))
- [#484](https://github.com/lblod/frontend-gelinkt-notuleren/pull/484) build(deps-dev): bump tracked-built-ins from 2.0.1 to 3.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#482](https://github.com/lblod/frontend-gelinkt-notuleren/pull/482) build(deps-dev): bump ember-power-select from 5.0.4 to 7.0.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#480](https://github.com/lblod/frontend-gelinkt-notuleren/pull/480) build(deps-dev): bump ember-template-lint from 4.18.2 to 5.10.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#485](https://github.com/lblod/frontend-gelinkt-notuleren/pull/485) build(deps-dev): bump @appuniversum/ember-appuniversum from 2.6.0 to 2.7.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#476](https://github.com/lblod/frontend-gelinkt-notuleren/pull/476) build(deps-dev): bump eslint from 7.32.0 to 8.42.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#479](https://github.com/lblod/frontend-gelinkt-notuleren/pull/479) build(deps-dev): bump ember-resolver from 9.0.1 to 10.1.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#474](https://github.com/lblod/frontend-gelinkt-notuleren/pull/474) Upgrade to ember 4.8.5 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 5.0.0 (2023-06-09)

#### :rocket: Enhancement

- [#442](https://github.com/lblod/frontend-gelinkt-notuleren/pull/442) GN-4159 - Feature/create revoke signature button ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 4.1.0 (2023-06-04)

#### :bug: Bug Fix

- [#469](https://github.com/lblod/frontend-gelinkt-notuleren/pull/469) Add date plugin to zitting-text-document-container and fix date config error ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#471](https://github.com/lblod/frontend-gelinkt-notuleren/pull/471) Update ember-acmidm-login to v2 ([@elpoelma](https://github.com/elpoelma))
- [#462](https://github.com/lblod/frontend-gelinkt-notuleren/pull/462) Update models and relationships ([@elpoelma](https://github.com/elpoelma))
- [#470](https://github.com/lblod/frontend-gelinkt-notuleren/pull/470) Bump socket.io-parser from 4.2.1 to 4.2.3 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3

- Deniss Kozickis ([@dkozickis](https://github.com/dkozickis))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 4.0.2 (2023-05-19)

#### :bug: Bug Fix

- [#468](https://github.com/lblod/frontend-gelinkt-notuleren/pull/468) GN-4140: Endpoint config for CitationPlugin Card ([@dkozickis](https://github.com/dkozickis))

#### Committers: 1

- Deniss Kozickis ([@dkozickis](https://github.com/dkozickis))

## 4.0.1 (2023-05-18)

#### :bug: Bug Fix

- [#467](https://github.com/lblod/frontend-gelinkt-notuleren/pull/467) Add image base url to env ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 4.0.0 (2023-05-18)

#### :boom: Breaking Change

- [#456](https://github.com/lblod/frontend-gelinkt-notuleren/pull/456) configure plugins without env variables ([@lagartoverde](https://github.com/lagartoverde))

#### :rocket: Enhancement

- [#461](https://github.com/lblod/frontend-gelinkt-notuleren/pull/461) Always show time on relative dates ([@lagartoverde](https://github.com/lagartoverde))
- [#456](https://github.com/lblod/frontend-gelinkt-notuleren/pull/456) configure plugins without env variables ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#464](https://github.com/lblod/frontend-gelinkt-notuleren/pull/464) Fix problem with powerselect not appearing ([@lagartoverde](https://github.com/lagartoverde))
- [#460](https://github.com/lblod/frontend-gelinkt-notuleren/pull/460) Remove border on hover on publication and meeting route ([@lagartoverde](https://github.com/lagartoverde))
- [#458](https://github.com/lblod/frontend-gelinkt-notuleren/pull/458) Add chrome hacks plugin to GN ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#457](https://github.com/lblod/frontend-gelinkt-notuleren/pull/457) Add au-modal-container and disable deprecation warnings for modal wormhole version ([@elpoelma](https://github.com/elpoelma))
- [#454](https://github.com/lblod/frontend-gelinkt-notuleren/pull/454) Bump vm2 from 3.9.16 to 3.9.17 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 4

- Deniss Kozickis ([@dkozickis](https://github.com/dkozickis))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- [@usrtim](https://github.com/usrtim)

## 3.4.1 (2023-04-21)

#### :bug: Bug Fix

- [#453](https://github.com/lblod/frontend-gelinkt-notuleren/pull/453) Bugfix/problem with title in dev ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 3.4.0 (2023-04-20)

#### :rocket: Enhancement

- [#452](https://github.com/lblod/frontend-gelinkt-notuleren/pull/452) avoid saving editor document title without changes ([@lagartoverde](https://github.com/lagartoverde))
- [#448](https://github.com/lblod/frontend-gelinkt-notuleren/pull/448) Improve RS Attachment styling ([@lagartoverde](https://github.com/lagartoverde))
- [#450](https://github.com/lblod/frontend-gelinkt-notuleren/pull/450) Enable link-paste-handler in agendapoints and regulatory statements ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#449](https://github.com/lblod/frontend-gelinkt-notuleren/pull/449) Fix schema of zitting-text component ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#451](https://github.com/lblod/frontend-gelinkt-notuleren/pull/451) Bump vm2 from 3.9.15 to 3.9.16 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#447](https://github.com/lblod/frontend-gelinkt-notuleren/pull/447) Bump vm2 from 3.9.11 to 3.9.15 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- [@usrtim](https://github.com/usrtim)

## 3.3.0 (2023-03-27)

#### :rocket: Enhancement

- [#444](https://github.com/lblod/frontend-gelinkt-notuleren/pull/444) feat(editor): bump to 3.4 and activate all the new features ([@abeforgit](https://github.com/abeforgit))

#### :bug: Bug Fix

- [#439](https://github.com/lblod/frontend-gelinkt-notuleren/pull/439) Update internal regulatory statement to support new editor API ([@elpoelma](https://github.com/elpoelma))
- [#427](https://github.com/lblod/frontend-gelinkt-notuleren/pull/427) GN-4088: Fix backlink of print ([@dkozickis](https://github.com/dkozickis))
- [#425](https://github.com/lblod/frontend-gelinkt-notuleren/pull/425) Hotfix: trim whitespace out of templates before instantiating them ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#435](https://github.com/lblod/frontend-gelinkt-notuleren/pull/435) Bump minimist from 0.2.1 to 0.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#436](https://github.com/lblod/frontend-gelinkt-notuleren/pull/436) Bump webpack from 5.74.0 to 5.76.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#441](https://github.com/lblod/frontend-gelinkt-notuleren/pull/441) Use new ember-concurrency api ([@elpoelma](https://github.com/elpoelma))
- [#432](https://github.com/lblod/frontend-gelinkt-notuleren/pull/432) Update ember-environment-banner to 0.2.0 ([@elpoelma](https://github.com/elpoelma))
- [#426](https://github.com/lblod/frontend-gelinkt-notuleren/pull/426) Internal/prevent hardcoded strings ([@lagartoverde](https://github.com/lagartoverde))
- [#417](https://github.com/lblod/frontend-gelinkt-notuleren/pull/417) Use kebab-case in translations and remove unused translations ([@elpoelma](https://github.com/elpoelma))
- [#424](https://github.com/lblod/frontend-gelinkt-notuleren/pull/424) Bump cacheable-request and release-it ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Deniss Kozickis ([@dkozickis](https://github.com/dkozickis))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 3.2.3 (2023-02-15)

#### :bug: Bug Fix

- [#429](https://github.com/lblod/frontend-gelinkt-notuleren/pull/429) Hotfix: trim whitespace out of templates before instantiating them ([@elpoelma](https://github.com/elpoelma))
- [#428](https://github.com/lblod/frontend-gelinkt-notuleren/pull/428) Hotfix: update plugins to 2.1.2 to solve codelist bug ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 3.2.2 (2023-02-09)

bump editor to v2.1.3

## 3.2.1 (2023-02-07)

#### :bug: Bug Fix

- [#421](https://github.com/lblod/frontend-gelinkt-notuleren/pull/421) Show unsaved changes correctly ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#419](https://github.com/lblod/frontend-gelinkt-notuleren/pull/419) Bump http-cache-semantics from 4.1.0 to 4.1.1 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#422](https://github.com/lblod/frontend-gelinkt-notuleren/pull/422) bump editor to v2.1.2 and plugins to v2.1.1 ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 3.2.0 (2023-02-06)

#### :rocket: Enhancement

- [#416](https://github.com/lblod/frontend-gelinkt-notuleren/pull/416) Add error routes to agendapoints, regulatory statements, meetings and the irg-archive ([@elpoelma](https://github.com/elpoelma))
- [#415](https://github.com/lblod/frontend-gelinkt-notuleren/pull/415) Addition of not-found route ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#418](https://github.com/lblod/frontend-gelinkt-notuleren/pull/418) Disable regulatory statement insert when its feature flag is disabled ([@elpoelma](https://github.com/elpoelma))
- [#414](https://github.com/lblod/frontend-gelinkt-notuleren/pull/414) Reroute irg-archive to login when not authenticated ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#420](https://github.com/lblod/frontend-gelinkt-notuleren/pull/420) Update editor and plugins to version 2.1.0 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 3.1.0 (2023-01-26)

#### :rocket: Enhancement

- [#410](https://github.com/lblod/frontend-gelinkt-notuleren/pull/410) Support for displaying which agendapoints are linked to a regulatory statement ([@elpoelma](https://github.com/elpoelma))
- [#402](https://github.com/lblod/frontend-gelinkt-notuleren/pull/402) Add new statuses for the regulatory statements ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#412](https://github.com/lblod/frontend-gelinkt-notuleren/pull/412) Fix i18n of human readable dates ([@elpoelma](https://github.com/elpoelma))
- [#409](https://github.com/lblod/frontend-gelinkt-notuleren/pull/409) Enable table keymap and allow block content in table cells ([@elpoelma](https://github.com/elpoelma))
- [#411](https://github.com/lblod/frontend-gelinkt-notuleren/pull/411) Add besluit-plugin stylesheet ([@elpoelma](https://github.com/elpoelma))
- [#408](https://github.com/lblod/frontend-gelinkt-notuleren/pull/408) Increase priority of regulatory statement node in schema ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#413](https://github.com/lblod/frontend-gelinkt-notuleren/pull/413) Update editor to 1.0.0 and plugins to 1.0.0-beta.8 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 3.0.1 (2023-01-25)

#### :house: Internal

- [#407](https://github.com/lblod/frontend-gelinkt-notuleren/pull/407) Update editor-plugins to 1.0.0 beta 6 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 3.0.0 (2023-01-25)

#### :rocket: Enhancement

- [#389](https://github.com/lblod/frontend-gelinkt-notuleren/pull/389) Integration of new prosemirror-based editor ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## v2.36.4 (2023-01-23)

#### :rocket: Enhancement

- [#406](https://github.com/lblod/frontend-gelinkt-notuleren/pull/406) Update irg-archive date to 18-01-2023 ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#404](https://github.com/lblod/frontend-gelinkt-notuleren/pull/404) Bump editor to 1.0.0-beta.2 and editor-plugins to 1.0.0-beta.1 ([@elpoelma](https://github.com/elpoelma))
- [#403](https://github.com/lblod/frontend-gelinkt-notuleren/pull/403) Update ember appuniversum to 2.2.0 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 2.37.3 (2023-01-12)

#### :rocket: Enhancement

- [#398](https://github.com/lblod/frontend-gelinkt-notuleren/pull/398) Bugfix/rs scrolling issue ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.37.2 (2023-01-10)

#### :rocket: Enhancement

- [#400](https://github.com/lblod/frontend-gelinkt-notuleren/pull/400) Add case insensitive sorting to all text-based/title columns ([@elpoelma](https://github.com/elpoelma))

## 2.36.4 (2023-01-23)

#### :rocket: Enhancement

- [#406](https://github.com/lblod/frontend-gelinkt-notuleren/pull/406) Update irg-archive date to 18-01-2023 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 2.37.0 (2023-01-04)

#### :rocket: Enhancement

- [#397](https://github.com/lblod/frontend-gelinkt-notuleren/pull/397) Feature/support long titles in meeting screen ([@lagartoverde](https://github.com/lagartoverde))
- [#392](https://github.com/lblod/frontend-gelinkt-notuleren/pull/392) Feature/solve inconsistencies ([@lagartoverde](https://github.com/lagartoverde))
- [#388](https://github.com/lblod/frontend-gelinkt-notuleren/pull/388) Don't allow participant list insertion if the chairman is not present ([@lagartoverde](https://github.com/lagartoverde))
- [#386](https://github.com/lblod/frontend-gelinkt-notuleren/pull/386) Feature/create new rs versions ([@lagartoverde](https://github.com/lagartoverde))
- [#385](https://github.com/lblod/frontend-gelinkt-notuleren/pull/385) Feature/restore old rs ([@lagartoverde](https://github.com/lagartoverde))
- [#384](https://github.com/lblod/frontend-gelinkt-notuleren/pull/384) Feature/rs revisions ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#395](https://github.com/lblod/frontend-gelinkt-notuleren/pull/395) Solved revisions not updating until page reload ([@lagartoverde](https://github.com/lagartoverde))
- [#394](https://github.com/lblod/frontend-gelinkt-notuleren/pull/394) Pass sort to the backend on uittreksels publication table ([@lagartoverde](https://github.com/lagartoverde))
- [#393](https://github.com/lblod/frontend-gelinkt-notuleren/pull/393) hotfix: remove empty decisions from document on save ([@usrtim](https://github.com/usrtim))
- [#390](https://github.com/lblod/frontend-gelinkt-notuleren/pull/390) Make title error visible and wrap when content is long ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#382](https://github.com/lblod/frontend-gelinkt-notuleren/pull/382) Bump @xmldom/xmldom from 0.8.3 to 0.8.6 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#381](https://github.com/lblod/frontend-gelinkt-notuleren/pull/381) Bump decode-uri-component from 0.2.0 to 0.2.2 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 2

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- [@usrtim](https://github.com/usrtim)

## 2.36.3 (2023-01-10)

#### :bug: Bug Fix

- [#399](https://github.com/lblod/frontend-gelinkt-notuleren/pull/399) Hide empty voter divs in notulen preview ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 2.36.2 (2022-12-21)

#### :bug: Bug Fix

- [#394](https://github.com/lblod/frontend-gelinkt-notuleren/pull/394) Pass sort to the backend on uittreksels publication table ([@lagartoverde](https://github.com/lagartoverde))
- [#393](https://github.com/lblod/frontend-gelinkt-notuleren/pull/393) hotfix: remove empty decisions from document on save ([@usrtim](https://github.com/usrtim))

#### Committers: 2

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- [@usrtim](https://github.com/usrtim)

## 2.36.1 (2022-12-07)

#### :bug: Bug Fix

- bump ember-rdfa-editor to 0.64.1, fixes issue with templates not showing in insert menu

## 2.36.0 (2022-12-07)

#### :rocket: Enhancement

- [#383](https://github.com/lblod/frontend-gelinkt-notuleren/pull/383) Add archive date to irg archive ([@elpoelma](https://github.com/elpoelma))
- [#373](https://github.com/lblod/frontend-gelinkt-notuleren/pull/373) Feature: non editable published regulatory statements ([@elpoelma](https://github.com/elpoelma))
- [#375](https://github.com/lblod/frontend-gelinkt-notuleren/pull/375) add a prompt when a user tries to leave a page with unsaved changes in a document (GN-3740) ([@usrtim](https://github.com/usrtim))

#### :bug: Bug Fix

- [#377](https://github.com/lblod/frontend-gelinkt-notuleren/pull/377) reset back to the url you were on after cancelling redirect ([@usrtim](https://github.com/usrtim))
- [#379](https://github.com/lblod/frontend-gelinkt-notuleren/pull/379) Fix weird title behaviour in regulatory statements edit page. ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#380](https://github.com/lblod/frontend-gelinkt-notuleren/pull/380) hide rs behind feature flag ([@nvdk](https://github.com/nvdk))
- [#374](https://github.com/lblod/frontend-gelinkt-notuleren/pull/374) Bump engine.io from 6.2.0 to 6.2.1 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 3

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))
- [@usrtim](https://github.com/usrtim)

## 2.35.0 (2022-11-18)

#### :rocket: Enhancement

- [#359](https://github.com/lblod/frontend-gelinkt-notuleren/pull/359) When saving an editorDocument retrieve and store its parts in the editor-document model ([@elpoelma](https://github.com/elpoelma))
- [#370](https://github.com/lblod/frontend-gelinkt-notuleren/pull/370) Feature/regulatory statements publication ([@elpoelma](https://github.com/elpoelma))
- [#363](https://github.com/lblod/frontend-gelinkt-notuleren/pull/363) Feature: prevent the duplicate inclusion of regulatory statements in a decision ([@elpoelma](https://github.com/elpoelma))
- [#361](https://github.com/lblod/frontend-gelinkt-notuleren/pull/361) When the notulen is published disable the editing ([@lagartoverde](https://github.com/lagartoverde))
- [#365](https://github.com/lblod/frontend-gelinkt-notuleren/pull/365) Feature/translation improvements ([@lagartoverde](https://github.com/lagartoverde))
- [#362](https://github.com/lblod/frontend-gelinkt-notuleren/pull/362) Feature/minor improvements ([@lagartoverde](https://github.com/lagartoverde))
- [#360](https://github.com/lblod/frontend-gelinkt-notuleren/pull/360) Sort regulatory statements by title when inserting a regulatory statement in an agendapoint ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#367](https://github.com/lblod/frontend-gelinkt-notuleren/pull/367) Move besluit property in regulatory statement plugin to dynamic getter. ([@elpoelma](https://github.com/elpoelma))
- [#364](https://github.com/lblod/frontend-gelinkt-notuleren/pull/364) Disable 'insert statement' button if there is no besluit present ([@elpoelma](https://github.com/elpoelma))
- [#366](https://github.com/lblod/frontend-gelinkt-notuleren/pull/366) Bugfix: only return title property if this.\_title is null or undefined ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#371](https://github.com/lblod/frontend-gelinkt-notuleren/pull/371) Bump article-structure plugin to 0.4.1 ([@elpoelma](https://github.com/elpoelma))
- [#372](https://github.com/lblod/frontend-gelinkt-notuleren/pull/372) Bump table of contents plugin to 0.5.0 ([@elpoelma](https://github.com/elpoelma))
- [#369](https://github.com/lblod/frontend-gelinkt-notuleren/pull/369) Update roadsign regulation plugin to version 0.9.5 ([@elpoelma](https://github.com/elpoelma))
- [#368](https://github.com/lblod/frontend-gelinkt-notuleren/pull/368) Update editor to version 0.64.0 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.34.0 (2022-11-07)

#### :rocket: Enhancement

- [#356](https://github.com/lblod/frontend-gelinkt-notuleren/pull/356) adapt query to the new model ([@lagartoverde](https://github.com/lagartoverde))
- [#355](https://github.com/lblod/frontend-gelinkt-notuleren/pull/355) Feature: decision regulatory statement coupling ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.33.2 (2022-11-07)

#### :bug: Bug Fix

- [#353](https://github.com/lblod/frontend-gelinkt-notuleren/pull/353) Fix issue with voting overview page where the number of votings are limited to 20 ([@elpoelma](https://github.com/elpoelma))
- [#354](https://github.com/lblod/frontend-gelinkt-notuleren/pull/354) Fix syntax issue that caused error when saving regulatory statement ([@elpoelma](https://github.com/elpoelma))
- [#351](https://github.com/lblod/frontend-gelinkt-notuleren/pull/351) Fix translation issue on attachments page ([@elpoelma](https://github.com/elpoelma))
- [#337](https://github.com/lblod/frontend-gelinkt-notuleren/pull/337) Save document title after edit ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#357](https://github.com/lblod/frontend-gelinkt-notuleren/pull/357) Update editor to 0.63.7 ([@elpoelma](https://github.com/elpoelma))
- [#352](https://github.com/lblod/frontend-gelinkt-notuleren/pull/352) Bump editor to 0.63.5 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- [@usrtim](https://github.com/usrtim)

## 2.33.1 (2022-10-25)

#### :rocket: Enhancement

- [#349](https://github.com/lblod/frontend-gelinkt-notuleren/pull/349) Add export-to-html menu action to regulatory-statements document view ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#350](https://github.com/lblod/frontend-gelinkt-notuleren/pull/350) Bump besluit-plugin to 0.5.7 ([@elpoelma](https://github.com/elpoelma))
- [#346](https://github.com/lblod/frontend-gelinkt-notuleren/pull/346) Bump template-variable-plugin to 0.9.0 ([@elpoelma](https://github.com/elpoelma))

#### Committers: 1

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))

## 2.33.0 (2022-10-20)

#### :rocket: Enhancement

- [#348](https://github.com/lblod/frontend-gelinkt-notuleren/pull/348) Use file service from regulatory-statements application in order to fetch template ([@elpoelma](https://github.com/elpoelma))
- [#297](https://github.com/lblod/frontend-gelinkt-notuleren/pull/297) Create revision layout ([@Dietr](https://github.com/Dietr))

#### :bug: Bug Fix

- [#345](https://github.com/lblod/frontend-gelinkt-notuleren/pull/345) Fix infinite pages when printing a meeting ([@Dietr](https://github.com/Dietr))
- [#342](https://github.com/lblod/frontend-gelinkt-notuleren/pull/342) Fix: prevent the confirm dialog to show up twice when exiting without saving ([@elpoelma](https://github.com/elpoelma))

#### :house: Internal

- [#343](https://github.com/lblod/frontend-gelinkt-notuleren/pull/343) Bump mout from 1.2.3 to 1.2.4 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#344](https://github.com/lblod/frontend-gelinkt-notuleren/pull/344) fix deprecations ([@usrtim](https://github.com/usrtim))
- [#340](https://github.com/lblod/frontend-gelinkt-notuleren/pull/340) Bump @xmldom/xmldom from 0.8.2 to 0.8.3 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 4

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))
- [@usrtim](https://github.com/usrtim)

## 2.32.1 (2022-10-12)

#### :bug: Bug Fix

- [#341](https://github.com/lblod/frontend-gelinkt-notuleren/pull/341) Fix regex which matches for generateUuid() in the template ([@elpoelma](https://github.com/elpoelma))
- [#338](https://github.com/lblod/frontend-gelinkt-notuleren/pull/338) fix: set start date to planned start on creation ([@nvdk](https://github.com/nvdk))

#### Committers: 2

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))

## 2.32.0 (2022-10-05)

#### :rocket: Enhancement

- [#325](https://github.com/lblod/frontend-gelinkt-notuleren/pull/325) Feature/regulatory statements ([@nvdk](https://github.com/nvdk))
- [#329](https://github.com/lblod/frontend-gelinkt-notuleren/pull/329) Rename 'concept' to 'In voorbereiding' ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#336](https://github.com/lblod/frontend-gelinkt-notuleren/pull/336) Fix sorting, search and pagination on RS overview page ([@abeforgit](https://github.com/abeforgit))
- [#334](https://github.com/lblod/frontend-gelinkt-notuleren/pull/334) Update toc plugin which fixes issues with overflowing entries ([@elpoelma](https://github.com/elpoelma))
- [#333](https://github.com/lblod/frontend-gelinkt-notuleren/pull/333) Filter based on validThrough property ([@lagartoverde](https://github.com/lagartoverde))
- [#327](https://github.com/lblod/frontend-gelinkt-notuleren/pull/327) Fix/button alignment ([@Dietr](https://github.com/Dietr))
- [#326](https://github.com/lblod/frontend-gelinkt-notuleren/pull/326) Repair basic RB registry integration ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#335](https://github.com/lblod/frontend-gelinkt-notuleren/pull/335) Add RB endpoints to devenv ([@abeforgit](https://github.com/abeforgit))

#### Committers: 5

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.31.1 (2022-09-30)

#### :bug: Bug Fix

- [#332](https://github.com/lblod/frontend-gelinkt-notuleren/pull/332) bumps the variable template plugin ([@nvdk](https://github.com/nvdk))
- [#331](https://github.com/lblod/frontend-gelinkt-notuleren/pull/331) Fixed bug where the attachment wasn't assigned to the first decision when inserted ([@lagartoverde](https://github.com/lagartoverde))
- [#330](https://github.com/lblod/frontend-gelinkt-notuleren/pull/330) Fix selection errors when trying to save with empty selection ([@abeforgit](https://github.com/abeforgit))

#### :house: Internal

- [#328](https://github.com/lblod/frontend-gelinkt-notuleren/pull/328) chore(deps): bump editor and plugins to newest bugfix releases ([@abeforgit](https://github.com/abeforgit))

#### Committers: 3

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.31.0 (2022-09-09)

#### :house: Internal

- [#324](https://github.com/lblod/frontend-gelinkt-notuleren/pull/324) bump editor to 0.63.1 and plugins to latest ([@abeforgit](https://github.com/abeforgit))
- [#323](https://github.com/lblod/frontend-gelinkt-notuleren/pull/323) Add release task to package.json ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 2.30.0 (2022-09-07)

#### :rocket: Enhancement

- [#319](https://github.com/lblod/frontend-gelinkt-notuleren/pull/319) Print preview improvements ([@Dietr](https://github.com/Dietr))
- [#313](https://github.com/lblod/frontend-gelinkt-notuleren/pull/313) Move position of the set vote private checkbox ([@lagartoverde](https://github.com/lagartoverde))
- [#316](https://github.com/lblod/frontend-gelinkt-notuleren/pull/316) Bugfix/make meeting date more clear ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#320](https://github.com/lblod/frontend-gelinkt-notuleren/pull/320) Ensure meeting is deleted from cache before returning to meeting overview when deleting a meeting ([@elpoelma](https://github.com/elpoelma))
- [#314](https://github.com/lblod/frontend-gelinkt-notuleren/pull/314) Environment banner styling and fixes ([@Dietr](https://github.com/Dietr))

#### :house: Internal

- [#321](https://github.com/lblod/frontend-gelinkt-notuleren/pull/321) Bump parse-path, release-it and release-it-lerna-changelog ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#318](https://github.com/lblod/frontend-gelinkt-notuleren/pull/318) extract environment banner functionality and component to seperate repo ([@elpoelma](https://github.com/elpoelma))

#### Committers: 4

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.29.0 (2022-08-12)

#### :rocket: Enhancement

- [#298](https://github.com/lblod/frontend-gelinkt-notuleren/pull/298) fetch decision types from centrale vindplaats ([@benjay10](https://github.com/benjay10))
- [#311](https://github.com/lblod/frontend-gelinkt-notuleren/pull/311) Addition of an environment banner ([@elpoelma](https://github.com/elpoelma))

#### :bug: Bug Fix

- [#308](https://github.com/lblod/frontend-gelinkt-notuleren/pull/308) Disable closing the edit agendapoint modal when saving ([@elpoelma](https://github.com/elpoelma))
- [#306](https://github.com/lblod/frontend-gelinkt-notuleren/pull/306) allow clearing the secretary ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#312](https://github.com/lblod/frontend-gelinkt-notuleren/pull/312) Bump editor to 0.61.1 ([@abeforgit](https://github.com/abeforgit))
- [#310](https://github.com/lblod/frontend-gelinkt-notuleren/pull/310) Bump parse-url from 6.0.0 to 6.0.5 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#307](https://github.com/lblod/frontend-gelinkt-notuleren/pull/307) Bump terser from 4.8.0 to 4.8.1 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Ben ([@benjay10](https://github.com/benjay10))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))

## 2.28.2 (2022-07-12)

#### :bug: Bug Fix

- [#305](https://github.com/lblod/frontend-gelinkt-notuleren/pull/305) bump editor ([@nvdk](https://github.com/nvdk))
- [#303](https://github.com/lblod/frontend-gelinkt-notuleren/pull/303) bump citation-plugin to 0.17.4 ([@nvdk](https://github.com/nvdk))
- [#302](https://github.com/lblod/frontend-gelinkt-notuleren/pull/302) only include relevant plugins for intro and outro text ([@nvdk](https://github.com/nvdk))
- [#301](https://github.com/lblod/frontend-gelinkt-notuleren/pull/301) bump ember-rdfa-editor-rdfa-date-plugin to 0.2.1 ([@nvdk](https://github.com/nvdk))
- [#300](https://github.com/lblod/frontend-gelinkt-notuleren/pull/300) bump @lblod/ember-rdfa-editor-citaten-plugin to 0.17.3 ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#299](https://github.com/lblod/frontend-gelinkt-notuleren/pull/299) Bump parse-url from 6.0.0 to 6.0.2 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.28.1 (2022-07-01)

#### :bug: Bug Fix

- [#296](https://github.com/lblod/frontend-gelinkt-notuleren/pull/296) Bugfix/search and pagination ([@Asergey91](https://github.com/Asergey91))

#### Committers: 1

- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.28.0 (2022-06-30)

#### :rocket: Enhancement

- [#293](https://github.com/lblod/frontend-gelinkt-notuleren/pull/293) added validation which enables/disables the delete button of a meeting based on the number of attached published resources ([@elpoelma](https://github.com/elpoelma))
- [#292](https://github.com/lblod/frontend-gelinkt-notuleren/pull/292) added export html functionality to irg archive document view ([@elpoelma](https://github.com/elpoelma))
- [#273](https://github.com/lblod/frontend-gelinkt-notuleren/pull/273) changing the geplandOpenbaar of an agendapoint affects the openbaar of a behandeling ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#294](https://github.com/lblod/frontend-gelinkt-notuleren/pull/294) Use paper view for intro and outro editor ([@Dietr](https://github.com/Dietr))
- [#292](https://github.com/lblod/frontend-gelinkt-notuleren/pull/292) added export html functionality to irg archive document view ([@elpoelma](https://github.com/elpoelma))

#### Committers: 3

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.27.1 (2022-06-30)

#### :house: Internal

- [#291](https://github.com/lblod/frontend-gelinkt-notuleren/pull/291) bump ember promise helpers to 2.0.0 ([@nvdk](https://github.com/nvdk))
- [#290](https://github.com/lblod/frontend-gelinkt-notuleren/pull/290) bump ay11-refocus to 3.0.0 ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.27.0 (2022-06-17)

#### :rocket: Enhancement

- [#280](https://github.com/lblod/frontend-gelinkt-notuleren/pull/280) improve error reporting if preview of notulen fails ([@nvdk](https://github.com/nvdk))
- [#282](https://github.com/lblod/frontend-gelinkt-notuleren/pull/282) bump rdfa-date-plugin to 0.2.0: enables manually adding an annotated date ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#288](https://github.com/lblod/frontend-gelinkt-notuleren/pull/288) IRG archive: fixed linting, fixed nan on archive pagination, fixed filtering, fixed return link ([@Asergey91](https://github.com/Asergey91))
- [#289](https://github.com/lblod/frontend-gelinkt-notuleren/pull/289) update package version of citaten-plugin: fixes confirmation popup on leaving edit route ([@elpoelma](https://github.com/elpoelma))

#### Committers: 3

- Elena Poelman ([@elpoelma](https://github.com/elpoelma))
- Niels V ([@nvdk](https://github.com/nvdk))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.26.0 (2022-06-10)

#### :rocket: Enhancement

- [#286](https://github.com/lblod/frontend-gelinkt-notuleren/pull/286) Plausible custom event 'Create agendapoint' ([@benjay10](https://github.com/benjay10))
- [#285](https://github.com/lblod/frontend-gelinkt-notuleren/pull/285) Introducing ember-plausible ([@benjay10](https://github.com/benjay10))
- [#283](https://github.com/lblod/frontend-gelinkt-notuleren/pull/283) irg archive ([@nvdk](https://github.com/nvdk))
- [#159](https://github.com/lblod/frontend-gelinkt-notuleren/pull/159) Feature/delete meetings ([@Asergey91](https://github.com/Asergey91))

#### :bug: Bug Fix

- [#287](https://github.com/lblod/frontend-gelinkt-notuleren/pull/287) Fixing unexpected closing of AuModal ([@benjay10](https://github.com/benjay10))

#### Committers: 3

- Ben ([@benjay10](https://github.com/benjay10))
- Niels V ([@nvdk](https://github.com/nvdk))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.25.1 (2022-06-09)

#### :rocket: Enhancement

- [#284](https://github.com/lblod/frontend-gelinkt-notuleren/pull/284) bump editor to version 0.59.1 ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.25.0 (2022-06-09)

#### :rocket: Enhancement

- [#276](https://github.com/lblod/frontend-gelinkt-notuleren/pull/276) added validation to meeting end date/time ([@Asergey91](https://github.com/Asergey91))
- [#277](https://github.com/lblod/frontend-gelinkt-notuleren/pull/277) bump rdfa-date-plugin to 0.1.1 ([@benjay10](https://github.com/benjay10))
- [#270](https://github.com/lblod/frontend-gelinkt-notuleren/pull/270) Made attachments pill clickable and go to the uploading part of the behandeling ([@lagartoverde](https://github.com/lagartoverde))
- [#274](https://github.com/lblod/frontend-gelinkt-notuleren/pull/274) Enhancement/editor redesign ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#281](https://github.com/lblod/frontend-gelinkt-notuleren/pull/281) Fix chrome print bug ([@Dietr](https://github.com/Dietr))

#### Committers: 5

- Ben ([@benjay10](https://github.com/benjay10))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.24.0 (2022-05-05)

#### :rocket: Enhancement

- [#275](https://github.com/lblod/frontend-gelinkt-notuleren/pull/275) bump editor: improved whitespace handling and table inserts ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#268](https://github.com/lblod/frontend-gelinkt-notuleren/pull/268) Fix alignment of datepicker dialogs in modal windows ([@Dietr](https://github.com/Dietr))
- [#271](https://github.com/lblod/frontend-gelinkt-notuleren/pull/271) Removed style that displayed article number as block ([@lagartoverde](https://github.com/lagartoverde))
- [#269](https://github.com/lblod/frontend-gelinkt-notuleren/pull/269) fix attachments number in the agendapoints screen ([@lagartoverde](https://github.com/lagartoverde))
- [#263](https://github.com/lblod/frontend-gelinkt-notuleren/pull/263) improve import flow using updated import plugin ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#267](https://github.com/lblod/frontend-gelinkt-notuleren/pull/267) bumped appuniversum to 1.0.9 ([@Asergey91](https://github.com/Asergey91))
- [#261](https://github.com/lblod/frontend-gelinkt-notuleren/pull/261) ran npm update ([@nvdk](https://github.com/nvdk))

#### Committers: 4

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.24.0-0 (2022-04-08)

#### :rocket: Enhancement

- [#266](https://github.com/lblod/frontend-gelinkt-notuleren/pull/266) Bump editor to v0.55.2 and update plugins to new versions ([@abeforgit](https://github.com/abeforgit))

#### :bug: Bug Fix

- [#265](https://github.com/lblod/frontend-gelinkt-notuleren/pull/265) Trim title on validation and on saving Agendapoint ([@benjay10](https://github.com/benjay10))
- [#264](https://github.com/lblod/frontend-gelinkt-notuleren/pull/264) Fixed off by one errors on adding agendapoints ([@benjay10](https://github.com/benjay10))

#### :house: Internal

- [#262](https://github.com/lblod/frontend-gelinkt-notuleren/pull/262) bump appuniversum to 1.0.3 ([@nvdk](https://github.com/nvdk))
- [#259](https://github.com/lblod/frontend-gelinkt-notuleren/pull/259) Chore/remove ember wormhole ([@nvdk](https://github.com/nvdk))
- [#246](https://github.com/lblod/frontend-gelinkt-notuleren/pull/246) bump template and decision type plugin ([@nvdk](https://github.com/nvdk))
- [#260](https://github.com/lblod/frontend-gelinkt-notuleren/pull/260) Chore/upgrade editor ([@nvdk](https://github.com/nvdk))

#### Committers: 3

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Ben ([@benjay10](https://github.com/benjay10))
- Niels V ([@nvdk](https://github.com/nvdk))

## 2.23.1 (2022-03-30)

#### :bug: Bug Fix

- [#258](https://github.com/lblod/frontend-gelinkt-notuleren/pull/258) show actual notulen content for published notulen ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.23.0 (2022-03-25)

#### :rocket: Enhancement

- [#257](https://github.com/lblod/frontend-gelinkt-notuleren/pull/257) IRGN: fetch location options from registry codelist ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#256](https://github.com/lblod/frontend-gelinkt-notuleren/pull/256) bump roadsign regulation plugin to 0.7.2 ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.22.2 (2022-03-22)

#### :bug: Bug Fix

- [#255](https://github.com/lblod/frontend-gelinkt-notuleren/pull/255) fix validation on publishing notulen ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.22.1 (2022-03-18)

#### :bug: Bug Fix

- [#254](https://github.com/lblod/frontend-gelinkt-notuleren/pull/254) fix labels in the citation plugin modal ([@nvdk](https://github.com/nvdk))
- [#253](https://github.com/lblod/frontend-gelinkt-notuleren/pull/253) Chore/upgrade roadsign regulation plugin ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.22.0 (2022-03-17)

#### :rocket: Enhancement

- [#252](https://github.com/lblod/frontend-gelinkt-notuleren/pull/252) improved regulation search + removed images from output ([@nvdk](https://github.com/nvdk))
- [#249](https://github.com/lblod/frontend-gelinkt-notuleren/pull/249) Generate a final preview for the notulen taking into account public behandelings ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 2

- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.21.1 (2022-03-14)

#### :rocket: Enhancement

- [#250](https://github.com/lblod/frontend-gelinkt-notuleren/pull/250) also update article number when reordering articles ([@nvdk](https://github.com/nvdk))
- [#251](https://github.com/lblod/frontend-gelinkt-notuleren/pull/251) improve variable support: add support for multi select codelists ([@nvdk](https://github.com/nvdk))
- [#248](https://github.com/lblod/frontend-gelinkt-notuleren/pull/248) bump roadsign plugin from 0.3.3 to 0.5.1 ([@nvdk](https://github.com/nvdk))
- [#247](https://github.com/lblod/frontend-gelinkt-notuleren/pull/247) make the template required when creating an agendapoint ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.21.0 (2022-02-25)

#### :bug: Bug Fix

- [#244](https://github.com/lblod/frontend-gelinkt-notuleren/pull/244) Fixing production builds "out of memory" problems ([@benjay10](https://github.com/benjay10))

#### :house: Internal

- [#243](https://github.com/lblod/frontend-gelinkt-notuleren/pull/243) Linting after upgrade 3.28 ([@benjay10](https://github.com/benjay10))
- [#200](https://github.com/lblod/frontend-gelinkt-notuleren/pull/200) Internal/ember upgrade ([@nvdk](https://github.com/nvdk))
- [#229](https://github.com/lblod/frontend-gelinkt-notuleren/pull/229) Bump nanoid from 3.1.29 to 3.2.0 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#241](https://github.com/lblod/frontend-gelinkt-notuleren/pull/241) Bump follow-redirects from 1.14.7 to 1.14.8 ([@dependabot[bot]](https://github.com/apps/dependabot))
- [#240](https://github.com/lblod/frontend-gelinkt-notuleren/pull/240) align both the browserlist and build targets ([@nvdk](https://github.com/nvdk))

#### Committers: 2

- Ben ([@benjay10](https://github.com/benjay10))
- Niels V ([@nvdk](https://github.com/nvdk))

## 2.20.6 (2022-02-11)

#### :rocket: Enhancement

- [#239](https://github.com/lblod/frontend-gelinkt-notuleren/pull/239) Bump ember-rdfa-editor from beta-7 to beta-8 ([@lagartoverde](https://github.com/lagartoverde))
- [#238](https://github.com/lblod/frontend-gelinkt-notuleren/pull/238) Bump besluit plugin from 0.1.3 to 0.1.4 ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.20.5 (2022-02-11)

#### :rocket: Enhancement

- [#237](https://github.com/lblod/frontend-gelinkt-notuleren/pull/237) Bump template variable plugin from 0.1.1 to 0.1.2 ([@lagartoverde](https://github.com/lagartoverde))
- [#236](https://github.com/lblod/frontend-gelinkt-notuleren/pull/236) Bump template-variable-plugin from 0.1.0 to 0.1.1 ([@lagartoverde](https://github.com/lagartoverde))
- [#235](https://github.com/lblod/frontend-gelinkt-notuleren/pull/235) Bump besluit-plugin from 0.1.2 to 0.1.3 ([@lagartoverde](https://github.com/lagartoverde))
- [#234](https://github.com/lblod/frontend-gelinkt-notuleren/pull/234) Bump roadsign regulation plugin from 0.3.2 to 0.3.3 ([@lagartoverde](https://github.com/lagartoverde))
- [#233](https://github.com/lblod/frontend-gelinkt-notuleren/pull/233) Bump editor version from 0.50.0-beta.4 to 0.50.0-beta.7 ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.20.4 (2022-02-04)

## 2.20.3 (2022-02-03)

#### :bug: Bug Fix

- [#232](https://github.com/lblod/frontend-gelinkt-notuleren/pull/232) bump regulation and template-variable plugin ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.20.2 (2022-01-26)

#### :rocket: Enhancement

- [#231](https://github.com/lblod/frontend-gelinkt-notuleren/pull/231) bump roadsign regulation plugin ([@nvdk](https://github.com/nvdk))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.20.1 (2022-01-24)

#### :rocket: Enhancement

- [#227](https://github.com/lblod/frontend-gelinkt-notuleren/pull/227) bump roadsign regulation plugin for better performance ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#230](https://github.com/lblod/frontend-gelinkt-notuleren/pull/230) Bump node-fetch from 2.6.2 to 2.6.7 ([@dependabot[bot]](https://github.com/apps/dependabot))

#### Committers: 1

- Niels V ([@nvdk](https://github.com/nvdk))

## 2.20.0 (2022-01-19)

#### :rocket: Enhancement

- [#225](https://github.com/lblod/frontend-gelinkt-notuleren/pull/225) add support for mobility measures (IRGN) ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#220](https://github.com/lblod/frontend-gelinkt-notuleren/pull/220) Update print preview ([@Dietr](https://github.com/Dietr))
- [#219](https://github.com/lblod/frontend-gelinkt-notuleren/pull/219) Fix spacing between titles/articles in publication view ([@Dietr](https://github.com/Dietr))
- [#218](https://github.com/lblod/frontend-gelinkt-notuleren/pull/218) Solved inconsistencies with the chairman between the meeting and behandeling ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#223](https://github.com/lblod/frontend-gelinkt-notuleren/pull/223) replace moment with helpers based on date-fns ([@nvdk](https://github.com/nvdk))
- [#221](https://github.com/lblod/frontend-gelinkt-notuleren/pull/221) Bump editor and corresponding appuniversum ([@abeforgit](https://github.com/abeforgit))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.19.1 (2021-11-18)

#### :rocket: Enhancement

- [#212](https://github.com/lblod/frontend-gelinkt-notuleren/pull/212) Feature/use appuniversum in editor ([@Dietr](https://github.com/Dietr))

#### :bug: Bug Fix

- [#215](https://github.com/lblod/frontend-gelinkt-notuleren/pull/215) correctly set the default for "openbaar" on treatment ([@nvdk](https://github.com/nvdk))
- [#217](https://github.com/lblod/frontend-gelinkt-notuleren/pull/217) sort added to ap in meeting form ([@Asergey91](https://github.com/Asergey91))
- [#216](https://github.com/lblod/frontend-gelinkt-notuleren/pull/216) Fix calendar popup overflow ([@Dietr](https://github.com/Dietr))
- [#213](https://github.com/lblod/frontend-gelinkt-notuleren/pull/213) Bugfix/agendapoint ordering ([@abeforgit](https://github.com/abeforgit))
- [#214](https://github.com/lblod/frontend-gelinkt-notuleren/pull/214) bump rdfa editor to move to support ember-appuniversum in rdfa-editor ([@nvdk](https://github.com/nvdk))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.19.0 (2021-10-20)

#### :rocket: Enhancement

- [#209](https://github.com/lblod/frontend-gelinkt-notuleren/pull/209) Feature/add article to bestuursorgan ([@lagartoverde](https://github.com/lagartoverde))
- [#207](https://github.com/lblod/frontend-gelinkt-notuleren/pull/207) Added attachments number to agendapoints table ([@lagartoverde](https://github.com/lagartoverde))
- [#210](https://github.com/lblod/frontend-gelinkt-notuleren/pull/210) Feature/add hash to printview ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#208](https://github.com/lblod/frontend-gelinkt-notuleren/pull/208) fix sorting on status in the agendapoint table ([@nvdk](https://github.com/nvdk))

#### Committers: 2

- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.18.0 (2021-10-06)

#### :rocket: Enhancement

- [#204](https://github.com/lblod/frontend-gelinkt-notuleren/pull/204) Only save document if it's in a dirty state ([@lagartoverde](https://github.com/lagartoverde))
- [#203](https://github.com/lblod/frontend-gelinkt-notuleren/pull/203) Change column order in attachments table ([@lagartoverde](https://github.com/lagartoverde))
- [#202](https://github.com/lblod/frontend-gelinkt-notuleren/pull/202) Add numbering to agendapoints in intermission select and fixed ordering ([@lagartoverde](https://github.com/lagartoverde))
- [#201](https://github.com/lblod/frontend-gelinkt-notuleren/pull/201) Add tooltip on attachment button ([@Dietr](https://github.com/Dietr))

#### :house: Internal

- [#199](https://github.com/lblod/frontend-gelinkt-notuleren/pull/199) bump ember auto import ([@nvdk](https://github.com/nvdk))

#### Committers: 3

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.17.0 (2021-09-24)

#### :rocket: Enhancement

- [#197](https://github.com/lblod/frontend-gelinkt-notuleren/pull/197) added an overview of attachments in meeting interface ([@Asergey91](https://github.com/Asergey91))
- [#193](https://github.com/lblod/frontend-gelinkt-notuleren/pull/193) Feature/enable acmidm switch ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#198](https://github.com/lblod/frontend-gelinkt-notuleren/pull/198) Fix issue with double characters ([@abeforgit](https://github.com/abeforgit))
- [#195](https://github.com/lblod/frontend-gelinkt-notuleren/pull/195) fix editor scrolling issue ([@Dietr](https://github.com/Dietr))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.16.0 (2021-09-17)

#### :rocket: Enhancement

- [#182](https://github.com/lblod/frontend-gelinkt-notuleren/pull/182) added agendapoint position to the select and the search ([@lagartoverde](https://github.com/lagartoverde))
- [#191](https://github.com/lblod/frontend-gelinkt-notuleren/pull/191) improved flow for creating agendapoints ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#188](https://github.com/lblod/frontend-gelinkt-notuleren/pull/188) correctly delete vote ([@nvdk](https://github.com/nvdk))
- [#192](https://github.com/lblod/frontend-gelinkt-notuleren/pull/192) Fix typo in outro component ([@lagartoverde](https://github.com/lagartoverde))
- [#190](https://github.com/lblod/frontend-gelinkt-notuleren/pull/190) added attachment counter to ap edit route, fixed bug with undefined length ([@Asergey91](https://github.com/Asergey91))
- [#187](https://github.com/lblod/frontend-gelinkt-notuleren/pull/187) Bugfix/missing router config for switch login route ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#189](https://github.com/lblod/frontend-gelinkt-notuleren/pull/189) use generator methods instead of fields in vote modal ([@nvdk](https://github.com/nvdk))
- [#185](https://github.com/lblod/frontend-gelinkt-notuleren/pull/185) use au-file-upload from appuniversum ([@nvdk](https://github.com/nvdk))

#### Committers: 3

- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.15.0 (2021-09-14)

#### :rocket: Enhancement

- [#172](https://github.com/lblod/frontend-gelinkt-notuleren/pull/172) Feature/acmidm switch ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#183](https://github.com/lblod/frontend-gelinkt-notuleren/pull/183) bugfix: allow large file uploads ([@nvdk](https://github.com/nvdk))

#### :house: Internal

- [#184](https://github.com/lblod/frontend-gelinkt-notuleren/pull/184) Fix/drag icon ([@Dietr](https://github.com/Dietr))

#### Committers: 2

- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))

## 2.14.0 (2021-09-09)

#### :rocket: Enhancement

- [#177](https://github.com/lblod/frontend-gelinkt-notuleren/pull/177) Calculated status based on the actual publication status of the extract ([@lagartoverde](https://github.com/lagartoverde))
- [#171](https://github.com/lblod/frontend-gelinkt-notuleren/pull/171) added a toggle to toggle all agendapoints to be public/private in notulen preview ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#178](https://github.com/lblod/frontend-gelinkt-notuleren/pull/178) Fix notulen was not correctly reloaded under a very specific scenario ([@lagartoverde](https://github.com/lagartoverde))
- [#180](https://github.com/lblod/frontend-gelinkt-notuleren/pull/180) [HOTFIX] Add updated items to changeset ([@nvdk](https://github.com/nvdk))
- [#175](https://github.com/lblod/frontend-gelinkt-notuleren/pull/175) Fixed page numbers in extract publication table ([@lagartoverde](https://github.com/lagartoverde))
- [#174](https://github.com/lblod/frontend-gelinkt-notuleren/pull/174) Add styling for tables still relying on webuniversum css ([@Dietr](https://github.com/Dietr))

#### :house: Internal

- [#176](https://github.com/lblod/frontend-gelinkt-notuleren/pull/176) Hide attachments behind feature flag ([@lagartoverde](https://github.com/lagartoverde))
- [#181](https://github.com/lblod/frontend-gelinkt-notuleren/pull/181) Remove requirebranch config ([@abeforgit](https://github.com/abeforgit))
- [#86](https://github.com/lblod/frontend-gelinkt-notuleren/pull/86) remove vo-webuniversum ([@nvdk](https://github.com/nvdk))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.13.0 (2021-09-03)

#### :rocket: Enhancement

- [#171](https://github.com/lblod/frontend-gelinkt-notuleren/pull/171) added a toggle to toggle all agendapoints to be public/private in notulen preview ([@lagartoverde](https://github.com/lagartoverde))

#### Committers: 1

- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.12.0 (2021-09-01)

#### :rocket: Enhancement

- [#150](https://github.com/lblod/frontend-gelinkt-notuleren/pull/150) full support for file attachments ([@nvdk](https://github.com/nvdk))
- [#157](https://github.com/lblod/frontend-gelinkt-notuleren/pull/157) Improve file upload UI ([@Asergey91](https://github.com/Asergey91))
- [#152](https://github.com/lblod/frontend-gelinkt-notuleren/pull/152) Feature/file upload ([@Asergey91](https://github.com/Asergey91))
- [#143](https://github.com/lblod/frontend-gelinkt-notuleren/pull/143) Feature/file upload ([@Asergey91](https://github.com/Asergey91))

#### :house: Internal

- [#168](https://github.com/lblod/frontend-gelinkt-notuleren/pull/168) Bump editor to v0.47.0 ([@abeforgit](https://github.com/abeforgit))

#### Committers: 3

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Niels V ([@nvdk](https://github.com/nvdk))
- Sergey Andreev ([@Asergey91](https://github.com/Asergey91))

## 2.11.0 (2021-08-30)

#### :rocket: Enhancement

- [#167](https://github.com/lblod/frontend-gelinkt-notuleren/pull/167) Use task flow for preview, signing and publication of notulen ([@abeforgit](https://github.com/abeforgit))

#### Committers: 1

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))

## 2.10.0 (2021-08-27)

#### :rocket: Enhancement

- [#164](https://github.com/lblod/frontend-gelinkt-notuleren/pull/164) async preview, signing and publication of a decision list ([@nvdk](https://github.com/nvdk))
- [#163](https://github.com/lblod/frontend-gelinkt-notuleren/pull/163) lazy load uittreksels ([@nvdk](https://github.com/nvdk))

#### :bug: Bug Fix

- [#165](https://github.com/lblod/frontend-gelinkt-notuleren/pull/165) Fix a bug where agenda items would have incorrect links to previous agenda items ([@abeforgit](https://github.com/abeforgit))

#### Committers: 2

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Niels V ([@nvdk](https://github.com/nvdk))

## 2.9.1 (2021-08-18)

#### :rocket: Enhancement

- [#160](https://github.com/lblod/frontend-gelinkt-notuleren/pull/160) Consume job for prepublishing ([@madnificent](https://github.com/madnificent))
- [#161](https://github.com/lblod/frontend-gelinkt-notuleren/pull/161) Improve wording around notification ([@abeforgit](https://github.com/abeforgit))
- [#156](https://github.com/lblod/frontend-gelinkt-notuleren/pull/156) Update the hostname in the footer ([@Windvis](https://github.com/Windvis))

#### :bug: Bug Fix

- [#162](https://github.com/lblod/frontend-gelinkt-notuleren/pull/162) BUGFIX: now you can sign and publish the same document and will be shown as such ([@lagartoverde](https://github.com/lagartoverde))
- [#160](https://github.com/lblod/frontend-gelinkt-notuleren/pull/160) Consume job for prepublishing ([@madnificent](https://github.com/madnificent))
- [#158](https://github.com/lblod/frontend-gelinkt-notuleren/pull/158) Fix print view overflow issue when &nbsp is used in text ([@Dietr](https://github.com/Dietr))

#### Committers: 5

- Aad Versteden ([@madnificent](https://github.com/madnificent))
- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
- Sam Van Campenhout ([@Windvis](https://github.com/Windvis))

## 2.9.0 (2021-07-16)

#### :rocket: Enhancement

- [#146](https://github.com/lblod/frontend-gelinkt-notuleren/pull/146) updated app universum and changed from au button to au link ([@lagartoverde](https://github.com/lagartoverde))
- [#149](https://github.com/lblod/frontend-gelinkt-notuleren/pull/149) Put voting modal buttons first ([@lagartoverde](https://github.com/lagartoverde))
- [#148](https://github.com/lblod/frontend-gelinkt-notuleren/pull/148) Feature/show agendapoints as 1 based ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#151](https://github.com/lblod/frontend-gelinkt-notuleren/pull/151) Fixed behandeling publishing status was not being updated properly without page refresh ([@lagartoverde](https://github.com/lagartoverde))
- [#127](https://github.com/lblod/frontend-gelinkt-notuleren/pull/127) Bugfix/error publishing notulen ([@lagartoverde](https://github.com/lagartoverde))

#### :house: Internal

- [#153](https://github.com/lblod/frontend-gelinkt-notuleren/pull/153) Bump editor to 0.46.1 ([@abeforgit](https://github.com/abeforgit))

#### Committers: 2

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## 2.8.0 (2021-07-02)

#### :rocket: Enhancement

- [#140](https://github.com/lblod/frontend-gelinkt-notuleren/pull/140) Feature/get draft description ([@lagartoverde](https://github.com/lagartoverde))

#### :bug: Bug Fix

- [#142](https://github.com/lblod/frontend-gelinkt-notuleren/pull/142) show mark-highlight-manual on print view ([@Dietr](https://github.com/Dietr))

#### :house: Internal

- [#147](https://github.com/lblod/frontend-gelinkt-notuleren/pull/147) Add lerna-changelog ([@abeforgit](https://github.com/abeforgit))
- [#145](https://github.com/lblod/frontend-gelinkt-notuleren/pull/145) bump import snippet plugin ([@nvdk](https://github.com/nvdk))
- [#144](https://github.com/lblod/frontend-gelinkt-notuleren/pull/144) Bump ember-rdfa-editor to v0.45.0 ([@abeforgit](https://github.com/abeforgit))

#### Committers: 4

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Dieter Peirs ([@Dietr](https://github.com/Dietr))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))

## v2.7.0 (2021-06-29)

#### :rocket: Enhancement

- [#137](https://github.com/lblod/frontend-gelinkt-notuleren/pull/137) bugfix: provide read only view, so that once the agendapoint is published the voting is visible in the meeting ([@lagartoverde](https://github.com/lagartoverde))
- [#139](https://github.com/lblod/frontend-gelinkt-notuleren/pull/139) Allow governor to be selected if deputation ([@abeforgit](https://github.com/abeforgit))

#### :bug: Bug Fix

- [#137](https://github.com/lblod/frontend-gelinkt-notuleren/pull/137) bugfix: provide read only view, so that once the agendapoint is published the voting is visible in the meeting ([@lagartoverde](https://github.com/lagartoverde))
- [#138](https://github.com/lblod/frontend-gelinkt-notuleren/pull/138) Bugfix/store public setting of treatment ([@nvdk](https://github.com/nvdk))

#### Committers: 3

- Arne Bertrand ([@abeforgit](https://github.com/abeforgit))
- Niels V ([@nvdk](https://github.com/nvdk))
- Oscar Rodriguez Villalobos ([@lagartoverde](https://github.com/lagartoverde))
