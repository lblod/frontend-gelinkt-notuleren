---
'frontend-gelinkt-notuleren': patch
---

Adjust mandatee queries to explicitly include the `rdf:type` of URIs which are consumed from LMB. This prevents us from querying tombstones.
