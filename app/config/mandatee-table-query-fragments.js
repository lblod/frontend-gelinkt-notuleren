export const fractieOrderingSubquery = (role, period, ignoreVotes) => `{
  SELECT ?fractie ?fractie_naam (COUNT(DISTINCT ?_persoon) AS ?fractie_grootte) (SUM(?_aantal_stemmen) AS ?fractie_stemmen)
  WHERE {
    ?_mandataris a mandaat:Mandataris.
    ?_mandataris org:hasMembership/org:organisation ?fractie.

    ?fractie a mandaat:Fractie.
    ?fractie regorg:legalName ?fractie_naam.

    ?_mandataris org:holds ?_mandaat.
    ?_mandaat org:role <${role}>.

    ?_bestuursorgaanIT org:hasPost ?_mandaat.
    ?_bestuursorgaanIT lmb:heeftBestuursperiode <${period}>.

    ?_persoon a person:Person.
    ?_mandataris mandaat:isBestuurlijkeAliasVan ?_persoon.

    ${
      ignoreVotes
        ? ''
        : `
    ?_verkiezing mandaat:steltSamen ?_bestuursorgaanIT.
    ?_verkiezingsresultaat mandaat:isResultaatVoor/mandaat:behoortTot ?_verkiezing.
    ?_verkiezingsresultaat mandaat:isResultaatVan ?_persoon.
    ?_verkiezingsresultaat mandaat:aantalNaamstemmen ?_aantal_stemmen.`
    }
  }
}`;
