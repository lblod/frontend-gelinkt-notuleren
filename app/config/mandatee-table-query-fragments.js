export const fractieOrderingSubquery = (
  bestuurseenheid,
  role,
  period,
  ignoreVotes,
) => `{
  SELECT ?fractie ?fractie_naam (COUNT(DISTINCT ?_persoon) AS ?fractie_grootte) ?fractie_stemmen
  WHERE {
    ?_mandataris a mandaat:Mandataris.
    ?_mandataris org:hasMembership/org:organisation ?fractie.

    ?fractie a mandaat:Fractie.
    ?fractie regorg:legalName ?fractie_naam.

    ?_mandataris org:holds ?_mandaat.
    ?_mandaat org:role <${role}>.

    ?_bestuursorgaanIT org:hasPost ?_mandaat.
    ?_bestuursorgaanIT lmb:heeftBestuursperiode <${period}>.

    ?_bestuursorgaanIT mandaat:isTijdspecialisatieVan ?_bestuursorgaan.
    ?_bestuursorgaan besluit:bestuurt <${bestuurseenheid}>.

    ?_persoon a person:Person.
    ?_mandataris mandaat:isBestuurlijkeAliasVan ?_persoon.

    ${
      ignoreVotes
        ? ''
        : `?fractie ext:geproduceerdDoor/ext:matched_stemmen ?fractie_stemmen.`
    }
  }
}`;
