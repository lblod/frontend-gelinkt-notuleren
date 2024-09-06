---
'frontend-gelinkt-notuleren': patch
---

When deleting a signature, and all signatures have been removed, ensure that the `deleted` status is set on the `fullNotulen` resource, not the `publicNotulen` resource
